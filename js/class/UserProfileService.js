class UserProfileService {
    #backendUrl = '';
    #userDetails = {};

    constructor(url) {
        this.#backendUrl = url;
    }

    // Fetch user profile initially and cache it
    fetchProfilePicture = async () => {
        try {
            const token = sessionStorage.getItem('token')
            const response = await fetch(`${this.#backendUrl}/users/getPicture`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            const json = await response.json()
            return json.profile_pic
        } catch (error) {
            console.error(error)
        }
    };

    // Update user profile picture
    setProfilePicture = async (imageSrc) => {
        try {
            const token = sessionStorage.getItem('token');
            const body = JSON.stringify({image: imageSrc});
            const response = await fetch(`${this.#backendUrl}/users/updatePicture`, {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: body
            });
            if (response.ok) {
                const json = await response.json();
                console.log('got json', json)
            }
        } catch (error) {
            console.error(error)
        }
    };

    changePassword = async (currentPassword, newPassword) => {
        try {
            const token = sessionStorage.getItem('token');
            const body = JSON.stringify({ currentPassword: currentPassword, newPassword: newPassword })
            const response = await fetch(`${this.#backendUrl}/users/changePassword`, {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: body
            })
            if (!response.ok) {
                return { success: false, message: 'Invalid password.' }
            }
            return { success: true, message: 'Password changed successfully.' };

        } catch (error) {
            console.error(error)
            return error
        }
    }
}

export { UserProfileService };
