import RegistrationData from '../../models/RegistrationData';

/**
 * Genera los datos de registro. El usuario/cédula y el correo DEBEN ser únicos en cada corrida:
 * WordPress los rechaza si ya existen, y un juego de datos fijo haría que CP-01 pase una sola vez
 * (ver R-06 del test plan). Por eso se generan dinámicamente y nunca se leen de un fixture.
 */
class DataFactory {
    /** Sufijo único por corrida, derivado del reloj — nunca un literal "ahora" hardcodeado. */
    uniqueSuffix() {
        return `${Date.now()}`;
    }

    /** Cédula sintética de 10 dígitos, reconocible como dato de prueba. */
    generateDocumentNumber() {
        return `10${this.uniqueSuffix()}`.slice(0, 10);
    }

    generateEmail(prefix = 'qa.bonbonite') {
        return `${prefix}+${this.uniqueSuffix()}@mailinator.com`;
    }

    /** Fecha en formato ISO (yyyy-MM-dd) que exige el input type="date" de "Mi cuenta". */
    isoDate(date = new Date()) {
        return date.toISOString().split('T')[0];
    }

    buildRegistrationData(template) {
        return new RegistrationData({
            ...template,
            username: this.generateDocumentNumber(),
            email: this.generateEmail()
        });
    }
}

export default new DataFactory();
