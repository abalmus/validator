export default function required(value, rule) {
    return (Boolean(rule) && (typeof value !== 'undefined' && value !== '' && value !== null && value !== false));
};
