CMS.registerEventListener({
    name: 'preLogin',
    handler: ({ user }) => {
        const allowed = ["dhishooooom-source", "friend-username"];

        if (!allowed.includes(user.login)) {
            alert("You are not allowed to access this admin panel.");
            throw new Error("Unauthorized user");
        }
    }
});
