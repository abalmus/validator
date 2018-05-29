import * as XRegExp from 'xregexp';

export default function pattern(value, regexp) {
    return XRegExp(regexp).test(String(value));
};
