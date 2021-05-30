const db = firebase.firestore(); //conexion con la base de datos
const taskForm = document.querySelector("#task-form"),
  tasksContrainer = document.getElementById("tasks-contrainer");
let editStatus = false, //sirve como bandera para cambiar el estado del boton edit
  id = ""; //esta variable la vamos a usar para pasar el id fuera del evento DOM contentLoaded

const saveTask = (title, description) =>
    db.collection("task").doc().set({ title, description }),
  getTasks = () => db.collection("task").get(), //obtine la informacion de mi coleccion
  onGetTasks = (callback) => db.collection("task").onSnapshot(callback), //actualiza cada vez que realizo alguna modificacion
  eliminarTarea = (id) => db.collection("task").doc(id).delete(), //ingresa a la coleccion, busca el id y elimina
  getTask = (id) => db.collection("task").doc(id).get(), //obtiene la tarea de un Id especifico
  updateTask = (id, updateTask) => db.collection("task").doc(id).update(updateTask);

window.addEventListener("DOMContentLoaded", async (e) => {
  const querySnapshot = await getTasks(); //querySnapshot es solo como suele llamar a los datos firebase pero lo puedo modificar pr cualquier nombre

  onGetTasks((querySnapshot) => {
    tasksContrainer.innerHTML = "";
    querySnapshot.forEach((doc) => {
      const tarea = doc.data(),
        tareaId = doc.id;
      tasksContrainer.innerHTML += `<div class="card card-body mt-2 border-light">
     <h3>${tarea.title}</h3>
     <p>${tarea.description}</p>
     <div>
     <button class="btn btn-warning btn-editar" data-id="${tareaId}">Editar</button>
     <button class="btn btn-danger btn-eliminar" data-id="${tareaId}">Eliminar</button>
     </div>
     </div>`;

      // llamo a todos los botones eliminar Y a cada boton eliminar le agrego un escuchador
      //***********BOTON EDITAR***********
      const btnEliminar = document.querySelectorAll(".btn-eliminar"),
        btnEditar = document.querySelectorAll(".btn-editar");
      btnEliminar.forEach((btn) => {
        btn.addEventListener("click", async (e) => {
          await eliminarTarea(e.target.dataset.id);
        });
      });
      //***********BOTON EDITAR***********
      btnEditar.forEach((btn) => {
        btn.addEventListener("click", async (e) => {
          const doc = await getTask(e.target.dataset.id);
          editStatus = true;
          id = e.target.dataset.id;
          taskForm["btn-task-form"].innerText = "Actualizar";
          taskForm["task-title"].value = doc.data().title;
          taskForm["task-description"].value = doc.data().description;
        });
      });
    });
  });
});

taskForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = taskForm["task-title"];
  const description = taskForm["task-description"];
  if (!editStatus) {
    await saveTask(title.value, description.value);
  } else {
    await updateTask(id, {
      title: title.value,
      description: description.value,
    }); 
     editStatus=false;
     id="";
     taskForm["btn-task-form"].innerText ="Guardar";
  }


  taskForm.reset();
  title.focus();
});
