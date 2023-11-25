import {useEffect, useState} from "react";
import { apiGetAuthUser } from "./api-requests";
import {useStore} from "@/store";

export default function useSession() {
    const store = useStore();
    const [user, setUser] = useState(null);

    const fetchUser = async () => {
        console.log("fetch user");
        try {
            const user = await apiGetAuthUser();
            store.setAuthUser(user);
        } catch (error: any) {
            console.log("error");
            store.reset();
        }
    }

    useEffect(() => {
        console.log("store changed");
        if (!store.authUser) {
            fetchUser();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [store.authUser]);

    return store.authUser;
}
