export function checkHeading(str) {
    if (!str) return false;
    return str.startsWith('**') || str.startsWith('##');
}

export function replaceHeadingStarts(str) {
    if (!str) return '';
    return str.replace(/^\*\*|##\s*/g, '').replace(/\*\*$/g, '').trim();
}