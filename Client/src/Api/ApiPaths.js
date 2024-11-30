
const ApiPaths = {
    user:{
        base: 'api/user',
        byID:(id) => `api/user/${id}`
    },
    account:{
        login: 'api/account/login',
        role: 'api/account/role',
    },
    auth:{
        auth: 'api/auth',
        refreshToken: '/api/auth/refresh-token'
    },
    grades:{
        base: 'api/grades',
        byID: (id) => `api/grades/${id}`
    },
    categories:{
        base: 'api/categories',
        byID: (id) => `api/categories/${id}`
    },
    threads: {
        base: 'api/threads',
        filtered: (category, grade, search) => {
            const params = new URLSearchParams();
            if (category) params.append('category', category);
            if (grade) params.append('grade', grade);
            if (search) params.append('search', search);
            return `api/threads?${params.toString()}`;
        }
    }
};

export default ApiPaths;
