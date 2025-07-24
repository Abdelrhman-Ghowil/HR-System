// Data transformation utilities for type-safe conversions

import { Employee, EmployeeInput, Evaluation, EvaluationInput } from '../types/shared';

/**
 * Safely converts string ID to number with validation
 */
export const safeParseId = (id: string | number): number => {
  if (typeof id === 'number') return id;
  const parsed = parseInt(id, 10);
  if (isNaN(parsed)) {
    throw new Error(`Invalid ID format: ${id}`);
  }
  return parsed;
};

/**
 * Transforms EmployeeInput to Employee for EvaluationDetails component
 */
export const transformEmployeeForEvaluation = (employeeInput: EmployeeInput): Employee => {
  try {
    return {
      employee_id: employeeInput.employee_id || '1',
      name: employeeInput.name,
      email: employeeInput.email,
      phone: employeeInput.phone,
      avatar: employeeInput.avatar,
      department: employeeInput.department,
      position: employeeInput.position,
      role: employeeInput.role,
      managerial_weight: employeeInput.managerialWeight,
      status: employeeInput.status,
      company_name: employeeInput.companyName,
      join_date: employeeInput.joinDate,
      user_id: '1',
      company_id: '1'
    };
  } catch (error) {
    console.error('Error transforming employee data:', error);
    throw new Error('Failed to transform employee data for evaluation');
  }
};

/**
 * Transforms EvaluationInput to Evaluation for EvaluationDetails component
 */
export const transformEvaluationForDetails = (evaluationInput: EvaluationInput, employeeId: number): Evaluation => {
  try {
    return {
      id: safeParseId(evaluationInput.id),
      employee_id: employeeId,
      type: evaluationInput.type,
      period: evaluationInput.period,
      status: evaluationInput.status,
      reviewer_id: evaluationInput.reviewer_id,
      date: evaluationInput.date,
      score: evaluationInput.score
    };
  } catch (error) {
    console.error('Error transforming evaluation data:', error);
    throw new Error('Failed to transform evaluation data');
  }
};

/**
 * Validates required fields for employee data
 */
export const validateEmployeeData = (employee: EmployeeInput): string[] => {
  const errors: string[] = [];
  
  if (!employee.id?.trim()) errors.push('Employee ID is required');
  if (!employee.name?.trim()) errors.push('Employee name is required');
  if (!employee.email?.trim()) errors.push('Employee email is required');
  if (!employee.position?.trim()) errors.push('Employee position is required');
  if (!employee.department?.trim()) errors.push('Employee department is required');
  if (!employee.joinDate) errors.push('Employee join date is required');
  
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (employee.email && !emailRegex.test(employee.email)) {
    errors.push('Invalid email format');
  }
  
  return errors;
};

/**
 * Validates required fields for evaluation data
 */
export const validateEvaluationData = (evaluation: EvaluationInput): string[] => {
  const errors: string[] = [];
  
  if (!evaluation.id?.trim()) errors.push('Evaluation ID is required');
  if (!evaluation.type?.trim()) errors.push('Evaluation type is required');
  if (!evaluation.period?.trim()) errors.push('Evaluation period is required');
  if (!evaluation.date) errors.push('Evaluation date is required');
  if (!evaluation.status) errors.push('Evaluation status is required');
  
  // Validate date format
  if (evaluation.date && isNaN(Date.parse(evaluation.date))) {
    errors.push('Invalid date format');
  }
  
  return errors;
};

/**
 * Safe data transformation with error handling
 */
export const safeTransformData = <T, R>(
  data: T,
  transformer: (data: T) => R,
  errorMessage: string
): { success: true; data: R } | { success: false; error: string } => {
  try {
    const result = transformer(data);
    return { success: true, data: result };
  } catch (error) {
    console.error(errorMessage, error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : errorMessage 
    };
  }
};

/**
 * Formats date for display
 */
export const formatDate = (dateString: string): string => {
  try {
    return new Date(dateString).toLocaleDateString();
  } catch {
    return 'Invalid Date';
  }
};

/**
 * Formats phone number with country code
 */
export const formatPhoneNumber = (phone: string, countryCode?: string): string => {
  const cleanPhone = phone?.replace(/[^0-9]/g, '') || '';
  const code = countryCode || '+1';
  return `${code} ${cleanPhone}`;
};

/**
 * Generates WhatsApp URL for phone number
 */
export const generateWhatsAppUrl = (phone: string, countryCode?: string): string => {
  const cleanPhone = phone?.replace(/[^0-9]/g, '') || '';
  const code = (countryCode || '+1').replace('+', '');
  return `https://wa.me/${code}${cleanPhone}`;
};