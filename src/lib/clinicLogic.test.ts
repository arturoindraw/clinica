import test from 'node:test';
import assert from 'node:assert/strict';
import {
  advanceCrmStage,
  buildWhatsAppUrl,
  getAvailableSlots,
  getFunnelMetrics,
  getTriageRecommendation,
  matchClinicFaq,
  validateBookingInput,
  verifyCrmAccessKey,
} from './clinicLogic';
import { INITIAL_CRM_CASES } from './clinicData';

test('triage returns hyperbaric and internal medicine protocol for pie-diabetico with FOMAG', () => {
  const rec = getTriageRecommendation('pie-diabetico', 'fomag');
  assert.match(rec.serviceTitle, /Pie Diabético/i);
  assert.match(rec.coverageGuidance, /FOMAG/i);
  assert.equal(rec.suggestedModality, 'presencial');
});

test('triage recommends domiciliary modality for lesion-presion', () => {
  const rec = getTriageRecommendation('lesion-presion', 'eps');
  assert.equal(rec.suggestedModality, 'domicilio');
  assert.match(rec.coverageGuidance, /EPS/i);
});

test('getAvailableSlots honors CAATH Monteria hours (Mon extended, Sat morning, Sun closed)', () => {
  // 2026-11-16 is Monday
  const mondaySlots = getAvailableSlots('2026-11-16', 'presencial');
  assert.ok(mondaySlots.includes('05:15 p. m.'));

  // 2026-11-17 is Tuesday (closes 5:30 p.m., last slot 04:45 p.m.)
  const tuesdaySlots = getAvailableSlots('2026-11-17', 'presencial');
  assert.ok(tuesdaySlots.includes('04:45 p. m.'));
  assert.ok(!tuesdaySlots.includes('05:15 p. m.'));

  // 2026-11-14 is Saturday (morning only)
  const saturdaySlots = getAvailableSlots('2026-11-14', 'presencial');
  assert.equal(saturdaySlots.length, 4);
  assert.ok(!saturdaySlots.some((slot) => slot.includes('p. m.')));

  // 2026-11-15 is Sunday (closed)
  const sundaySlots = getAvailableSlots('2026-11-15', 'presencial');
  assert.equal(sundaySlots.length, 0);
});

test('validateBookingInput rejects empty fields and Sunday dates', () => {
  const bad = validateBookingInput({
    patientName: 'Al',
    phone: '123',
    date: '2026-11-15',
    timeSlot: '',
    modality: 'presencial',
    coverage: 'particular',
  });
  assert.equal(bad.valid, false);
  assert.ok(bad.errors.patientName);
  assert.ok(bad.errors.phone);
  assert.ok(bad.errors.date);
  assert.ok(bad.errors.timeSlot);

  const ok = validateBookingInput({
    patientName: 'Ana Sofía Gómez',
    phone: '3244400883',
    date: '2026-11-16',
    timeSlot: '09:00 a. m.',
    modality: 'presencial',
    coverage: 'fomag',
  });
  assert.equal(ok.valid, true);
  assert.deepEqual(ok.errors, {});
});

test('CRM funnel advancement and metrics update accurately', () => {
  const before = getFunnelMetrics(INITIAL_CRM_CASES);
  assert.equal(before.Lead, 1);
  assert.equal(before.Calificado, 1);

  const updated = advanceCrmStage(INITIAL_CRM_CASES, 'CAATH-4085');
  const after = getFunnelMetrics(updated);
  assert.equal(after.Lead, 0);
  assert.equal(after.Calificado, 2);
});

test('matchClinicFaq resolves core Monteria clinic inquiries accurately', () => {
  assert.match(matchClinicFaq('¿Dónde queda la clínica?'), /Cra 14 #37-7/i);
  assert.match(matchClinicFaq('¿Atienden por FOMAG?'), /FOMAG/i);
  assert.match(matchClinicFaq('¿Horarios los sábados?'), /Sábados de 8:00/i);
  assert.match(matchClinicFaq('cámara hiperbárica'), /Cámara Hiperbárica/i);
  assert.match(buildWhatsAppUrl('Hola CAATH'), /^https:\/\/wa\.me\/573244400883\?text=/);
});

test('verifyCrmAccessKey accepts valid institutional key and rejects invalid keys', () => {
  assert.equal(verifyCrmAccessKey('CAATH2026'), true);
  assert.equal(verifyCrmAccessKey(' caath2026 '), true);
  assert.equal(verifyCrmAccessKey('WRONG'), false);
  assert.equal(verifyCrmAccessKey(''), false);
});
