// src/utils/helpers.js - Funciones de validación

export function validarRut(rut) {
  rut = rut.replace(/\./g, '').replace('-', '');
  if (rut.length < 7 || rut.length > 9) return false;

  const cuerpo = rut.slice(0, -1);
  let dv = rut.slice(-1).toUpperCase();
  if (cuerpo.length < 7) return false;

  let suma = 0, multiplo = 2;
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    const digito = parseInt(cuerpo.charAt(i), 10);
    if (isNaN(digito)) return false;
    suma += digito * multiplo;
    multiplo = multiplo === 7 ? 2 : multiplo + 1;
  }

  let dvEsperado = 11 - (suma % 11);
  dvEsperado = dvEsperado === 11 ? '0' : dvEsperado === 10 ? 'K' : String(dvEsperado);
  return dv === dvEsperado;
}

export function validarDominioCorreo(email) {
  // Validación deshabilitada: permite cualquier dominio
  return true;
}

export const regionesYComunas = {
  "Región Metropolitana": ["Santiago","Providencia","Las Condes","Ñuñoa","Maipú","La Florida","Puente Alto"],
  "Valparaíso": ["Valparaíso","Viña del Mar","Quilpué","Villa Alemana","San Antonio"],
  "Biobío": ["Concepción","Talcahuano","Los Ángeles","Chillán","Coronel"]
};

export function validarFormularioRegistro(formData) {
  const errores = {};

  // RUT
  if (!formData.run?.trim()) {
    errores.run = '❌ El RUT es obligatorio';
  } else if (formData.run.length < 7 || formData.run.length > 9) {
    errores.run = '❌ El RUT debe tener entre 7 y 9 caracteres';
  } else if (!validarRut(formData.run)) {
    errores.run = '❌ RUT inválido';
  }

  // Nombre
  if (!formData.nombre?.trim() || formData.nombre.length > 50) {
    errores.nombre = '❌ Nombre obligatorio, máximo 50 caracteres';
  }

  // Apellidos
  if (!formData.apellidos?.trim() || formData.apellidos.length > 100) {
    errores.apellidos = '❌ Apellidos obligatorios, máximo 100 caracteres';
  }

  // Email
  if (!formData.email?.trim()) {
    errores.email = '❌ El correo es obligatorio';
  } else if (formData.email.length > 100) {
    errores.email = '❌ Máximo 100 caracteres';
  } else if (!validarDominioCorreo(formData.email)) {
    errores.email = '❌ Solo correos @duoc.cl, @profesor.duoc.cl o @gmail.com';
  }

  // Dirección
  if (!formData.direccion?.trim() || formData.direccion.length > 300) {
    errores.direccion = '❌ Dirección obligatoria, máximo 300 caracteres';
  }

  return errores;
}

export function validarFormularioLogin(formData) {
  const errores = {};

  if (!formData.email?.trim() || formData.email.length > 100) {
    errores.email = '❌ Correo obligatorio, máximo 100 caracteres';
  } else if (!validarDominioCorreo(formData.email)) {
    errores.email = '❌ Solo dominios @duoc.cl, @profesor.duoc.cl, @gmail.com';
  }

  if (!formData.password?.trim() || formData.password.length < 4 || formData.password.length > 10) {
    errores.password = '❌ Contraseña entre 4 y 10 caracteres';
  }

  return errores;
}

export function validarFormularioContacto(formData) {
  const errores = {};

  if (!formData.nombre?.trim() || formData.nombre.length > 100) {
    errores.nombre = '❌ Nombre obligatorio, máximo 100 caracteres';
  }

  if (formData.email?.length > 100) {
    errores.email = '❌ Máximo 100 caracteres';
  } else if (formData.email && !validarDominioCorreo(formData.email)) {
    errores.email = '❌ Solo dominios permitidos';
  }

  if (!formData.comentario?.trim() || formData.comentario.length > 500) {
    errores.comentario = '❌ Comentario obligatorio, máximo 500 caracteres';
  }

  return errores;
}
