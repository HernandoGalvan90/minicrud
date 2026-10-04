const API_URL='/tasks'
document.addEventListener('DOMContentLoaded',cargarTareas);
document.getElementById('taskForm').addEventListener('submit',manejarEnvio);

async function manejarEnvio(e) {
    e.preventDefault();
    const id=document.getElementById('taskId').value;
    const titulo=document.getElementById('titulo').value.trim();
    const descripcion=document.getElementById('descripcion').value.trim();
    const estado=document.getElementById('estado').value;

    if(!titulo){
        mostrarMensaje('Titulo Obligatorio','error');
        return;
    }

    const metodo= id ? 'PUT':'POST'
    const url=id? `${API_URL}/${id}`:API_URL;

    try{
        const res = await fetch(url, {
            method:metodo,
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify({titulo,descripcion,estado})

        });

    const data=await res.json();
    
    if (res.ok){
        mostrarMensaje(data.message,'exito');
        resetForm();
        cargarTareas();
    }else{
        mostrarMensaje(data.error||'ERROR AL GUARDAR', 'error');
    }

    
    }catch(error){
        mostrarMensaje('Error de conexion', 'error');

    }
}


async function cargarTareas(){
    try{
        const res= await fetch(API_URL);
        const tareas= await res.json();

        const tbody=document.getElementById('tablaTareas');
        tbody.innerHTML='';

        if(tareas.length===0){
            tbody.innerHTML=`<tr><td colspan="6" class="vacio">NO HAY TAREAS</td></tr>`;
            return;
        }

        tareas.forEach(tarea=>{
            const tr =document.createElement('tr');
            tr.innerHTML=`
            <td>${tarea.id}</td>
            <td>${tarea.titulo}</td>
            <td>${tarea.descripcion||'-'}</td>
            <td><span class="estado ${tarea.estado.replace(' ','-')}">${tarea.estado}</span></td>
            <td>${tarea.fecha_creacion}</td>
            <td class="acciones">
                <button class="btn-editar" onclick="editarTarea(${tarea.id},'${escape(tarea.titulo)}','${escape(tarea.descripcion || '')}','${escape(tarea.estado)}' )">EDITAR</button>
                <button class="btn-eliminar" onclick="eliminarTarea(${tarea.id})">ELIMINAR</button>
                </td>
            `;
            tbody.appendChild(tr);
        });


    }catch(error){
        mostrarMensaje('ERROR AL CARGAR','error');

    }
    
}

function editarTarea(id,titulo,descripcion,estado){
    document.getElementById('taskId').value=id;
    document.getElementById('titulo').value=titulo;
    document.getElementById('descripcion').value=descripcion;
    document.getElementById('estado').value=estado;

    document.getElementById('btnGuardar').textContent='Actualizar';
    document.getElementById('btnCancelar').classList.remove('oculto');

    document.getElementById('taskForm').scrollIntoView({'behavior':'smooth'});



}


async function eliminarTarea(id) {
    if (!confirm('Seguro?')) return;

    try{
        const res= await fetch(`${API_URL}/${id}`,{method:'DELETE'});
        const data = await res.json();

        if (res.ok){
            mostrarMensaje(data.message, 'exito');
            cargarTareas();
        }else{
            mostrarMensaje(data.error ||'ERROR AL ELIMINAR','error');
        }

    }catch(error){
        mostrarMensaje('error de conexion','error');

    }
    
}

function resetForm(){
    document.getElementById('taskForm').reset();
    document.getElementById('taskId').value='';
    document.getElementById('btnGuardar').textContent='Guardar Tarea';
    document.getElementById('btnCancelar').classList.add('oculto');
}

function mostrarMensaje(texto, tipo){
    const div= document.getElementById('mensaje');
    div.textContent=texto;
    div.className=tipo;
    setTimeout(() => {
        div.className ='oculto';

    },3000);

}

function escape(str){
    return String(str).replace(/'/g,"\\'").replace(/"/g,'&quot;');
}
