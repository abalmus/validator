export default function maxlength(value, rule) {
    return (value && String(value).length <= Number(rule));
};
