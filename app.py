
from flask import Flask, render_template, request, redirect, url_for, jsonify, flash, session
import sqlite3
import datetime
import os
from datetime import timedelta
from twilio.rest import Client

app = Flask(__name__)
app.secret_key = "doctor_appointment_system_secret_key"

# Database setup
def get_db_connection():
    conn = sqlite3.connect('appointments.db')
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    conn.execute('''
    CREATE TABLE IF NOT EXISTS procedures (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        duration INTEGER NOT NULL
    )
    ''')
    
    conn.execute('''
    CREATE TABLE IF NOT EXISTS appointments (
        id INTEGER PRIMARY KEY,
        patient_name TEXT NOT NULL,
        phone_number TEXT NOT NULL,
        procedure_id INTEGER NOT NULL,
        start_time TEXT NOT NULL,
        end_time TEXT NOT NULL,
        additional_time INTEGER DEFAULT 0,
        FOREIGN KEY (procedure_id) REFERENCES procedures (id)
    )
    ''')
    
    conn.execute('''
    CREATE TABLE IF NOT EXISTS doctors (
        id INTEGER PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
    )
    ''')
    
    conn.execute('''
    CREATE TABLE IF NOT EXISTS patients (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        phone_number TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE
    )
    ''')
    
    # Insert default procedures if none exist
    procedures = conn.execute('SELECT * FROM procedures').fetchall()
    if not procedures:
        procedures_data = [
            ('Regular Checkup', 15),
            ('Initial Consultation', 30),
            ('Follow-up Visit', 20),
            ('Complete Physical', 45),
            ('Urgent Care', 25)
        ]
        conn.executemany('INSERT INTO procedures (name, duration) VALUES (?, ?)', procedures_data)
    
    # Insert a default doctor if none exist
    doctors = conn.execute('SELECT * FROM doctors').fetchall()
    if not doctors:
        conn.execute('INSERT INTO doctors (username, password) VALUES (?, ?)', ('doctor', 'password'))
    
    conn.commit()
    conn.close()

# Initialize database
init_db()

# Twilio setup for SMS notifications
TWILIO_ACCOUNT_SID = os.environ.get('TWILIO_ACCOUNT_SID', '')
TWILIO_AUTH_TOKEN = os.environ.get('TWILIO_AUTH_TOKEN', '')
TWILIO_PHONE_NUMBER = os.environ.get('TWILIO_PHONE_NUMBER', '')

def send_sms(to_number, message):
    if TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN and TWILIO_PHONE_NUMBER:
        try:
            client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
            client.messages.create(
                body=message,
                from_=TWILIO_PHONE_NUMBER,
                to=to_number
            )
            return True
        except Exception as e:
            print(f"SMS sending error: {e}")
            return False
    return False

# AI Logic: Analyze and adjust schedules
def recalculate_appointments(break_duration=5, break_enabled=True):
    conn = get_db_connection()
    appointments = conn.execute('SELECT * FROM appointments ORDER BY start_time').fetchall()
    modified_appointments = []
    
    if not appointments:
        conn.close()
        return []
    
    # First appointment stays as is
    for i in range(1, len(appointments)):
        prev_end = datetime.datetime.fromisoformat(appointments[i-1]['end_time'])
        
        # Add break time if enabled
        if break_enabled:
            new_start = prev_end + timedelta(minutes=break_duration)
        else:
            new_start = prev_end
            
        # Calculate duration from procedure and additional time
        proc_id = appointments[i]['procedure_id']
        procedure = conn.execute('SELECT duration FROM procedures WHERE id = ?', (proc_id,)).fetchone()
        base_duration = procedure['duration']
        additional_time = appointments[i]['additional_time']
        total_duration = base_duration + additional_time
        
        # Set new times
        new_end = new_start + timedelta(minutes=total_duration)
        
        # Get patient phone number
        patient_phone = appointments[i]['phone_number']
        
        # Update database
        old_start = datetime.datetime.fromisoformat(appointments[i]['start_time'])
        conn.execute('''
        UPDATE appointments 
        SET start_time = ?, end_time = ?
        WHERE id = ?
        ''', (new_start.isoformat(), new_end.isoformat(), appointments[i]['id']))
        
        # If appointment time changed, add to modified list
        if old_start != new_start:
            modified_appointments.append({
                'id': appointments[i]['id'],
                'patient_name': appointments[i]['patient_name'],
                'phone_number': patient_phone,
                'old_time': old_start.strftime('%I:%M %p'),
                'new_time': new_start.strftime('%I:%M %p'),
                'date': new_start.strftime('%B %d, %Y')
            })
    
    conn.commit()
    conn.close()
    return modified_appointments

# Routes
@app.route('/')
def landing():
    return render_template('landing.html')

@app.route('/doctor/login', methods=['GET', 'POST'])
def doctor_login():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        
        conn = get_db_connection()
        doctor = conn.execute('SELECT * FROM doctors WHERE username = ? AND password = ?', 
                            (username, password)).fetchone()
        conn.close()
        
        if doctor:
            session['doctor_id'] = doctor['id']
            session['is_doctor'] = True
            return redirect(url_for('doctor_dashboard'))
        else:
            flash('Invalid username or password', 'error')
    
    return render_template('doctor_login.html')

@app.route('/doctor/dashboard')
def doctor_dashboard():
    if not session.get('is_doctor'):
        return redirect(url_for('doctor_login'))
    
    conn = get_db_connection()
    today = datetime.datetime.now().strftime('%Y-%m-%d')
    appointments = conn.execute('''
        SELECT a.*, p.name as procedure_name, p.duration as base_duration 
        FROM appointments a 
        JOIN procedures p ON a.procedure_id = p.id 
        WHERE DATE(a.start_time) = ?
        ORDER BY a.start_time
    ''', (today,)).fetchall()
    
    procedures = conn.execute('SELECT * FROM procedures').fetchall()
    conn.close()
    
    return render_template('doctor_dashboard.html', 
                          appointments=[dict(a) for a in appointments], 
                          procedures=[dict(p) for p in procedures])

@app.route('/patient/check')
def patient_check():
    return render_template('patient_check.html')

@app.route('/patient/dashboard', methods=['GET', 'POST'])
def patient_dashboard():
    if request.method == 'POST':
        phone_number = request.form.get('phone_number')
        
        conn = get_db_connection()
        appointments = conn.execute('''
            SELECT a.*, p.name as procedure_name
            FROM appointments a 
            JOIN procedures p ON a.procedure_id = p.id 
            WHERE a.phone_number = ? AND datetime(a.start_time) > datetime('now')
            ORDER BY a.start_time
        ''', (phone_number,)).fetchall()
        conn.close()
        
        return render_template('patient_dashboard.html', 
                              appointments=[dict(a) for a in appointments],
                              phone_number=phone_number)
    
    return redirect(url_for('patient_check'))

@app.route('/api/appointments', methods=['POST'])
def add_appointment():
    if not session.get('is_doctor'):
        return jsonify({'error': 'Unauthorized'}), 401
    
    data = request.json
    
    patient_name = data.get('patient_name')
    phone_number = data.get('phone_number')
    procedure_id = data.get('procedure_id')
    start_time = data.get('start_time')
    
    if not all([patient_name, phone_number, procedure_id, start_time]):
        return jsonify({'error': 'Missing required fields'}), 400
    
    conn = get_db_connection()
    
    # Get procedure duration
    procedure = conn.execute('SELECT duration FROM procedures WHERE id = ?', (procedure_id,)).fetchone()
    if not procedure:
        conn.close()
        return jsonify({'error': 'Invalid procedure ID'}), 400
    
    # Calculate end time
    start_datetime = datetime.datetime.fromisoformat(start_time)
    end_datetime = start_datetime + timedelta(minutes=procedure['duration'])
    
    # Add the appointment
    cursor = conn.execute('''
        INSERT INTO appointments 
        (patient_name, phone_number, procedure_id, start_time, end_time, additional_time)
        VALUES (?, ?, ?, ?, ?, 0)
    ''', (patient_name, phone_number, procedure_id, start_time, end_datetime.isoformat()))
    
    # Save patient info if new
    conn.execute('''
        INSERT OR IGNORE INTO patients (name, phone_number)
        VALUES (?, ?)
    ''', (patient_name, phone_number))
    
    conn.commit()
    
    # Get the new appointment ID
    appointment_id = cursor.lastrowid
    
    # Recalculate appointments
    modified_appointments = recalculate_appointments()
    
    # Send SMS notifications for modified appointments
    for appt in modified_appointments:
        message = f"Hello {appt['patient_name']}, your appointment on {appt['date']} has been rescheduled from {appt['old_time']} to {appt['new_time']}."
        send_sms(appt['phone_number'], message)
    
    # Send confirmation to new patient
    message = f"Hello {patient_name}, your appointment has been scheduled for {start_datetime.strftime('%B %d, %Y at %I:%M %p')}."
    send_sms(phone_number, message)
    
    conn.close()
    
    return jsonify({
        'id': appointment_id,
        'message': 'Appointment added successfully',
        'modified_appointments': len(modified_appointments)
    })

@app.route('/api/appointments/<int:appointment_id>', methods=['PUT'])
def update_appointment(appointment_id):
    if not session.get('is_doctor'):
        return jsonify({'error': 'Unauthorized'}), 401
    
    data = request.json
    additional_time = data.get('additional_time', 0)
    
    conn = get_db_connection()
    
    # Get the appointment
    appointment = conn.execute('SELECT * FROM appointments WHERE id = ?', (appointment_id,)).fetchone()
    if not appointment:
        conn.close()
        return jsonify({'error': 'Appointment not found'}), 404
    
    # Get procedure duration
    procedure = conn.execute('SELECT duration FROM procedures WHERE id = ?', (appointment['procedure_id'],)).fetchone()
    
    # Calculate new end time
    start_datetime = datetime.datetime.fromisoformat(appointment['start_time'])
    total_duration = procedure['duration'] + additional_time
    end_datetime = start_datetime + timedelta(minutes=total_duration)
    
    # Update the appointment
    conn.execute('''
        UPDATE appointments 
        SET additional_time = ?, end_time = ?
        WHERE id = ?
    ''', (additional_time, end_datetime.isoformat(), appointment_id))
    
    conn.commit()
    
    # Recalculate appointments
    modified_appointments = recalculate_appointments()
    
    # Send SMS notifications for modified appointments
    for appt in modified_appointments:
        message = f"Hello {appt['patient_name']}, your appointment on {appt['date']} has been rescheduled from {appt['old_time']} to {appt['new_time']}."
        send_sms(appt['phone_number'], message)
    
    conn.close()
    
    return jsonify({
        'message': 'Appointment updated successfully',
        'modified_appointments': len(modified_appointments)
    })

@app.route('/api/appointments/<int:appointment_id>', methods=['DELETE'])
def delete_appointment(appointment_id):
    if not session.get('is_doctor'):
        return jsonify({'error': 'Unauthorized'}), 401
    
    conn = get_db_connection()
    
    # Get the appointment
    appointment = conn.execute('SELECT * FROM appointments WHERE id = ?', (appointment_id,)).fetchone()
    if not appointment:
        conn.close()
        return jsonify({'error': 'Appointment not found'}), 404
    
    # Delete the appointment
    conn.execute('DELETE FROM appointments WHERE id = ?', (appointment_id,))
    conn.commit()
    
    # Recalculate appointments
    modified_appointments = recalculate_appointments()
    
    # Send SMS notifications for modified appointments
    for appt in modified_appointments:
        message = f"Hello {appt['patient_name']}, your appointment on {appt['date']} has been rescheduled from {appt['old_time']} to {appt['new_time']}."
        send_sms(appt['phone_number'], message)
    
    conn.close()
    
    return jsonify({
        'message': 'Appointment deleted successfully',
        'modified_appointments': len(modified_appointments)
    })

@app.route('/api/break-time', methods=['POST'])
def set_break_time():
    if not session.get('is_doctor'):
        return jsonify({'error': 'Unauthorized'}), 401
    
    data = request.json
    break_duration = data.get('break_duration', 5)
    break_enabled = data.get('break_enabled', True)
    
    # Recalculate appointments with new break settings
    modified_appointments = recalculate_appointments(break_duration, break_enabled)
    
    # Send SMS notifications for modified appointments
    for appt in modified_appointments:
        message = f"Hello {appt['patient_name']}, your appointment on {appt['date']} has been rescheduled from {appt['old_time']} to {appt['new_time']}."
        send_sms(appt['phone_number'], message)
    
    return jsonify({
        'message': 'Break time updated successfully',
        'modified_appointments': len(modified_appointments)
    })

if __name__ == '__main__':
    app.run(debug=True)
