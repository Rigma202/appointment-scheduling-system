import { createRoot } from 'react-dom/client';
import { ensureNotifyHost } from './ui/notify';

import AppointmentsApp from './components/AppointmentsApp';
import AppointmentForm from './components/AppointmentForm';
import AvailabilityChecker from './components/AvailabilityChecker';
import DoctorsApp from './components/DoctorsApp';
import DoctorForm from './components/DoctorForm';
import PatientsApp from './components/PatientsApp';
import PatientForm from './components/PatientForm';


const registry = {
    appointments: AppointmentsApp,
    'appointment-form': AppointmentForm,
    availability: AvailabilityChecker,
    doctors: DoctorsApp,
    'doctor-form': DoctorForm,
    patients: PatientsApp,
    'patient-form': PatientForm,
};

function mountAll() {
    ensureNotifyHost();

    document.querySelectorAll('[data-react]').forEach((el) => {
        if (el.dataset.mounted) return;
        const name = el.dataset.react;
        const Component = registry[name];
        if (!Component) {
            console.warn(`[react] no component registered for "${name}"`);
            return;
        }
        let props = {};
        if (el.dataset.props) {
            try {
                props = JSON.parse(el.dataset.props);
            } catch (e) {
                console.error(`[react] invalid data-props for "${name}"`, e);
            }
        }
        el.dataset.mounted = 'true';
        createRoot(el).render(<Component {...props} />);
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountAll);
} else {
    mountAll();
}
