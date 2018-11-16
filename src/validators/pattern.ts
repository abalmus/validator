export default function pattern(value, regexp) {
    return RegExp(regexp).test(String(value));
};
