import Joi from 'joi';

interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

// Login validation
export const validateLoginInput = (data: any): ValidationResult => {
  const schema = Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'E-mail deve ter um formato válido',
      'any.required': 'E-mail é obrigatório'
    }),
    password: Joi.string().min(6).required().messages({
      'string.min': 'Senha deve ter pelo menos 6 caracteres',
      'any.required': 'Senha é obrigatória'
    })
  });

  const { error } = schema.validate(data);
  
  return {
    isValid: !error,
    errors: error ? error.details.map(detail => detail.message) : []
  };
};

// Patient validation
export const validatePatientInput = (data: any, isUpdate = false): ValidationResult => {
  const schema = Joi.object({
    name: isUpdate 
      ? Joi.string().min(2).max(100).optional()
      : Joi.string().min(2).max(100).required().messages({
          'string.min': 'Nome deve ter pelo menos 2 caracteres',
          'string.max': 'Nome deve ter no máximo 100 caracteres',
          'any.required': 'Nome é obrigatório'
        }),
    email: Joi.string().email().optional().allow('').messages({
      'string.email': 'E-mail deve ter um formato válido'
    }),
    phone: Joi.string().optional().allow(''),
    birth_date: isUpdate
      ? Joi.date().optional()
      : Joi.date().required().messages({
          'any.required': 'Data de nascimento é obrigatória'
        }),
    cpf: isUpdate
      ? Joi.string().pattern(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/).optional()
      : Joi.string().pattern(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/).required().messages({
          'string.pattern.base': 'CPF deve estar no formato 000.000.000-00',
          'any.required': 'CPF é obrigatório'
        }),
    address: Joi.string().optional().allow(''),
    emergency_contact: Joi.string().optional().allow(''),
    medical_history: Joi.string().optional().allow(''),
    status: Joi.string().valid('active', 'inactive').optional()
  });

  const { error } = schema.validate(data);
  
  return {
    isValid: !error,
    errors: error ? error.details.map(detail => detail.message) : []
  };
};

// Appointment validation
export const validateAppointmentInput = (data: any, isUpdate = false): ValidationResult => {
  const schema = Joi.object({
    patient_id: isUpdate
      ? Joi.number().integer().positive().optional()
      : Joi.number().integer().positive().required().messages({
          'number.positive': 'ID do paciente deve ser positivo',
          'any.required': 'ID do paciente é obrigatório'
        }),
    doctor_id: isUpdate
      ? Joi.number().integer().positive().optional()
      : Joi.number().integer().positive().required().messages({
          'number.positive': 'ID do médico deve ser positivo',
          'any.required': 'ID do médico é obrigatório'
        }),
    specialty: isUpdate
      ? Joi.string().max(50).optional()
      : Joi.string().max(50).required().messages({
          'string.max': 'Especialidade deve ter no máximo 50 caracteres',
          'any.required': 'Especialidade é obrigatória'
        }),
    appointment_date: isUpdate
      ? Joi.date().optional()
      : Joi.date().required().messages({
          'any.required': 'Data do agendamento é obrigatória'
        }),
    appointment_time: isUpdate
      ? Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/).optional()
      : Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/).required().messages({
          'string.pattern.base': 'Horário deve estar no formato HH:MM ou HH:MM:SS',
          'any.required': 'Horário do agendamento é obrigatório'
        }),
    duration: Joi.number().integer().min(15).max(180).optional().default(30),
    status: Joi.string().valid('scheduled', 'confirmed', 'cancelled', 'completed').optional(),
    notes: Joi.string().optional().allow('')
  });

  const { error } = schema.validate(data);
  
  return {
    isValid: !error,
    errors: error ? error.details.map(detail => detail.message) : []
  };
};

// User validation
export const validateUserInput = (data: any, isUpdate = false): ValidationResult => {
  const schema = Joi.object({
    name: isUpdate
      ? Joi.string().min(2).max(100).optional()
      : Joi.string().min(2).max(100).required().messages({
          'string.min': 'Nome deve ter pelo menos 2 caracteres',
          'string.max': 'Nome deve ter no máximo 100 caracteres',
          'any.required': 'Nome é obrigatório'
        }),
    email: isUpdate
      ? Joi.string().email().optional()
      : Joi.string().email().required().messages({
          'string.email': 'E-mail deve ter um formato válido',
          'any.required': 'E-mail é obrigatório'
        }),
    password: isUpdate
      ? Joi.string().min(6).optional()
      : Joi.string().min(6).required().messages({
          'string.min': 'Senha deve ter pelo menos 6 caracteres',
          'any.required': 'Senha é obrigatória'
        }),
    role: Joi.string().valid('admin', 'doctor', 'nurse', 'receptionist').optional().default('doctor'),
    crm: Joi.string().max(20).optional().allow(''),
    phone: Joi.string().optional().allow('')
  });

  const { error } = schema.validate(data);
  
  return {
    isValid: !error,
    errors: error ? error.details.map(detail => detail.message) : []
  };
};