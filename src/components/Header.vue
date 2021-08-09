<template>
  <div>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <div class="container">
            <a class="navbar-brand" href="#">GISTUD</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarResponsive">
                <ul class="navbar-nav ms-auto">
                    <li class="nav-item active">
                        <a class="nav-link" href="/">Главная</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="/groupSelecting">Расписание</a>
                    </li>
                    <li :v-if="!loggedIn" class="nav-item">
                        <a class="nav-link" href="/signup">Регистрация</a>
                    </li>
                    <li :v-if="!loggedIn" class="nav-item">
                        <a class="nav-link" href="/login">Войти</a>
                    </li>
                    <li :v-if="loggedIn" @click="logout" class="nav-item">
                        <a class="nav-link" href="/">Выйти</a>
                    </li>
                    <li :v-if="!!currentUser" class="nav-item">
                        {{currentUser ? currentUser.username : ''}}
                    </li>
                </ul>
            </div>
        </div>
    </nav>
</div>
</template>

<script>
import { useStore } from "vuex";
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";

export default {
    name: "Header",

    setup() {
        const store = useStore();
        const router = useRouter();
        const loggedIn = ref(store.state.auth.loggedIn)

        return {
            loggedIn,
            currentUser : computed(()=>store.state.auth.user),

            logout() {
                store.dispatch("auth/logoutAction");
                router.push('/');
            }
        }
    }
}
</script>

<style>

</style>