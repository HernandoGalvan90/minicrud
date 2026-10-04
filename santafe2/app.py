from flask import Flask, request, jsonify, render_template
import pyodbc

app=Flask(__name__)

def get_db_connection():
    return pyodbc.connect(
        'DRIVER={ODBC Driver 17 for SQL Server};SERVER=localhost;DATABASE=TEST101;Trusted_Connection=yes;TrustServerCertificate=yes;'
    )

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/tasks', methods=['GET'])
def get_tasks():
    try:
        conn=get_db_connection()
        cursor=conn.cursor()
        cursor.execute("SELECT id, titulo, descripcion, estado, fecha_creacion FROM diego")
        rows=cursor.fetchall()
        tareas= [{
            'id':r[0],
            'titulo':r[1],
            'descripcion':r[2],
            'estado':r[3],
            'fecha_creacion':str(r[4])
        }for r in rows]
        conn.close()
        return jsonify(tareas), 200
    except Exception as e:
        return jsonify({'error':str(e)}),500

@app.route('/tasks', methods=['POST'])
def create_task():
    try:
        data=request.json 
        if not data.get('titulo') or data['titulo'].strip()=='':
            return jsonify({'error':'Titulo obligatorio'}),400

        conn=get_db_connection()
        cursor=conn.cursor()
        cursor.execute("INSERT INTO diego (titulo, descripcion, estado) VALUES (?,?,?)",
        (data['titulo'], data.get('descripcion',''), data.get('estado','pendiente')))
        conn.commit()
        conn.close()
        return jsonify({'message':'Creada'}), 201
    except Exception as e:
        return jsonify({'error':str(e)}),500

@app.route('/tasks/<int:id>', methods=['PUT'])
def update_task(id):
    try:
        data=request.json 
        if not data.get('titulo') or data['titulo'].strip()=='':
            return jsonify({'error':'Titulo obligatorio'}),400

        conn=get_db_connection()
        cursor=conn.cursor()
        cursor.execute("UPDATE diego SET titulo=?, descripcion=?, estado=? WHERE id=?",
        (data['titulo'], data.get('descripcion',''), data.get('estado','pendiente'),id))
        conn.commit()
        conn.close()
        return jsonify({'message':'Actualizada'}), 201
    except Exception as e:
        return jsonify({'error':str(e)}),500

@app.route('/tasks/<int:id>', methods=['DELETE'])
def delete_task(id):
    try:
        conn=get_db_connection()
        cursor=conn.cursor()
        cursor.execute("DELETE FROM diego WHERE id=?",(id,))
        conn.commit()
        conn.close()
        return jsonify({'message':'Eliminada'}), 201
    except Exception as e:
        return jsonify({'error':str(e)}),500

if __name__=='__main__':
    app.run(debug=True, port=5000)





    

