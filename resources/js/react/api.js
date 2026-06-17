import axios from 'axios';

const token = document
    .querySelector('meta[name="csrf-token"]')
    ?.getAttribute('content');

const api = axios.create({
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'X-CSRF-TOKEN': token,
        Accept: 'application/json',
    },
});

export default api;

// Normalises a Laravel error response into { status, message, errors, data }.
export function parseError(error) {
    const res = error?.response;
    return {
        status: res?.status ?? 0,
        message: res?.data?.message ?? 'Something went wrong.',
        errors: res?.data?.errors ?? {},
        data: res?.data ?? {},
    };
}
