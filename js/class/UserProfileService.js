class UserProfileService {
    #backendUrl = '';
    #userDetails = {};

    constructor(url) {
        this.#backendUrl = url;
    }

    // Fetch user profile initially and cache it
    fetchProfilePicture = async () => {
        try {
            const response = await fetch(`${this.#backendUrl}/users/getPicture`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (response.ok) {
                const json = await response.json()
                return json.profile_pic
            }
            return this.#userDetails;
        } catch (error) {
            console.error(error)
        }
    };

    // Update user profile picture
    setProfilePicture = async (imageSrc) => {
        try {
            const body = JSON.stringify({image: imageSrc});
            const response = await fetch(`${this.#backendUrl}/users/updatePicture`, {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
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
}

export { UserProfileService };
