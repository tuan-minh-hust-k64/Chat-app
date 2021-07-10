const generateMessage = (text,user_name) => {
    return {
        user_name,
        text,
        createAt: new Date().getTime(),
    }
}
const generateMessageLink = (text, user_name) => {
    return {
        user_name,
        text,
        createAt: new Date().getTime(),
    }
}
module.exports = {
    generateMessage,
    generateMessageLink,
}