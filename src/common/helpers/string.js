export default {
  limit(string, charNum = 20) {
    const value = string.toString();
    const ellipsis = value && value.length > charNum ? '...' : '';
    return value ? value.substring(0, charNum) + ellipsis : '';
  },

// http://shebang.brandonmintern.com/foolproof-html-escaping-in-javascript/
  escape(string) {
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(string.toString()));
    return div.innerHTML;
  },
};
