from flask import Flask, request, jsonify
from flask_cors import CORS
import pymysql

app = Flask(__name__)
CORS(app)

def conectar(vhost, vuser, vpass, vdb):
    conn = pymysql.connect(host=vhost, user=vuser, passwd=vpass, db=vdb, charset='utf8mb4')
    return conn

@app.route("/")
def consulta_general(): 
    try:
        conn = conectar('localhost', 'root', '', 'gestor_contrasena')
        cur = conn.cursor()
        cur.execute("SELECT * FROM baul")
        datos = cur.fetchall()
        data = []
        for row in datos:
            dato = {'id_baul': row[0], 'Plataforma': row[1], 'usuario': row[2], 'clave': row[3]}
            data.append(dato)
        cur.close()
        conn.close()
        return jsonify({'baul': data, 'mensaje': 'Baúl de contraseñas'})
    except Exception as ex:
        print(ex)
        return jsonify({'mensaje': 'Error'})
    
@app.route("/consulta_individual/<codigo>", methods=['GET'])
def consulta_individual(codigo):
    try:
        conn = conectar('localhost', 'root', '', 'gestor_contrasena')
        cur = conn.cursor()
        
        # Usamos un marcador de posición para el valor de 'codigo'
        cur.execute("SELECT * FROM baul WHERE id_baul = %s", (codigo,))
        
        datos = cur.fetchone()
        cur.close()
        conn.close()
        
        if datos is not None:
            dato = {'id_baul': datos[0], 'Plataforma': datos[1], 'usuario': datos[2], 'clave': datos[3]}
            return jsonify({'baul': dato, 'mensaje': 'Registro encontrado'})
        else:
            return jsonify({'mensaje': 'Registro no encontrado'})
    except Exception as ex:
        print(ex)
        return jsonify({'mensaje': 'Error'})

    
@app.route("/eliminar/<codigo>", methods=['DELETE'])
def eliminar(codigo):
    try:
        conn = conectar('localhost', 'root', '', 'gestor_contrasena')
        cur = conn.cursor()

        
        cur.execute("DELETE FROM baul WHERE id_baul = %s", (codigo,))
        
        conn.commit()  
        cur.close()
        conn.close()

        return jsonify({'mensaje': 'Registro eliminado'})
    
    except Exception as ex:
        print(ex)
        return jsonify({'mensaje': 'Registro eliminado'})



@app.route("/actualizar/<codigo>", methods=['PUT'])
def actualizar(codigo):
    try:
        conn = conectar('localhost', 'root', '', 'gestor_contrasena')
        cur = conn.cursor()
        cur.execute("UPDATE baul SET Plataforma = %s, usuario = %s, clave = %s WHERE id_baul = %s",
                    (request.json['Plataforma'], request.json['usuario'], request.json['clave'], codigo))
        conn.commit()
        cur.close()
        conn.close()
        return jsonify({'mensaje': 'Registro actualizado'})
    except Exception as ex:
        print(ex)
        return jsonify({'mensaje': 'Error'})
    
    
@app.route("/registro/", methods=['POST'])
def registro():
    try:
        conn = conectar('localhost', 'root', '', 'gestor_contrasena')
        cur = conn.cursor()
        
        # Inserción de datos en la tabla
        cur.execute("INSERT INTO baul (Plataforma, usuario, clave) VALUES (%s, %s, %s)",
                    (request.json['Plataforma'], request.json['usuario'], request.json['clave']))
        
        conn.commit()  # Confirmar los cambios
        cur.close()
        conn.close()
        return jsonify({'mensaje': 'Registro agregado'})
    except Exception as ex:
        print(ex)
        return jsonify({'mensaje': 'Error al agregar registro'})


if __name__ == '__main__':
    app.run(debug=True)
