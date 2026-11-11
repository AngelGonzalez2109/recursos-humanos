import type { Vacante, VacanteFormValues } from '../types/vacante'

export function emptyVacanteForm(defaultEmpresa: string): VacanteFormValues {
  return {
    titulo: '',
    empresa: defaultEmpresa,
    ubicacion: '',
    modalidad: 'presencial',
    tipoContrato: 'tiempo_completo',
    descripcion: '',
    requisitos: '',
    salarioMin: '',
    salarioMax: '',
    moneda: 'MXN',
    edadMin: '',
    edadMax: '',
    nivelEstudios: '',
    gradoAcademico: '',
    experienciaAnios: '',
    habilidades: [],
    areasEvaluacion: [],
  }
}

const text = (value: number | null) => (value === null ? '' : String(value))

/** Rellena el formulario de edición con los datos guardados de la vacante */
export function vacanteToFormValues(v: Vacante): VacanteFormValues {
  return {
    titulo: v.titulo,
    empresa: v.empresa,
    ubicacion: v.ubicacion,
    modalidad: v.modalidad,
    tipoContrato: v.tipo_contrato,
    descripcion: v.descripcion,
    requisitos: v.requisitos,
    salarioMin: text(v.salario_min),
    salarioMax: text(v.salario_max),
    moneda: v.moneda,
    edadMin: text(v.edad_min),
    edadMax: text(v.edad_max),
    nivelEstudios: v.nivel_estudios ?? '',
    gradoAcademico: v.grado_academico ?? '',
    experienciaAnios: text(v.experiencia_anios),
    habilidades: v.habilidades,
    areasEvaluacion: v.areas_evaluacion ?? [],
  }
}
