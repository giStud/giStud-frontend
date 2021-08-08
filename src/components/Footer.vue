<template>
  <div>
    <footer id="footer" class="text-center text-white" style="background-color: #0a4275;">
        <div class="container p-4 pb-0">
            <section class="">
                <p class="d-flex justify-content-center align-items-center">
                    <span class="me-3">Пройти регистрацию</span>
                    <button @click="register" type="button" class="btn btn-outline-light btn-rounded">
                        Регистрация
                    </button>
                </p>
            </section>
        </div>
        <div class="text-center p-3" style="background-color: rgba(0, 0, 0, 0.2);">
            ©{{new Date().getFullYear()}} Copyright:
            <a class="text-white" href="/">GISTUD</a>
        </div>
    </footer>
</div>
</template>

<script>
export default {
    methods: {
        register() {
            window.location = "/registration"
        }
    }
}
</script>

<style>

</style>