<template>
    <div class="error-page" @click="refresh">
        <c-header>
            <x-header :left-options="{ backText: '' }">出错了~~~</x-header>
        </c-header>
        <div style="text-align: center;margin-top:50px;">
            <img alt src="../../assets/imgs/wbs/ydzz_konghezi@2x.png" width="125" />
            <div class="p">{{ errorMsg }}</div>
            <div v-if="isShowRefresh" class="p">点击刷新</div>
        </div>
    </div>
</template>

<script>
import { AppFinish } from '../../utils/app.js';
export default {
    data() {
        return {
            errorMsg: this.$route.query.errorMsg || '访问错误，请稍后再试~~~',
            isShowRefresh: false
        };
    },
    created() {
        this.$store.commit('updateLoadingStatus', { isLoading: false });
        // ApphiddenNativeNav();
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            if (from.name == 'TCIndex' || from.name == 'roadTransCapacity') {
                vm.isShowRefresh = true;
            } else {
                vm.isShowRefresh = false;
            }
        });
    },
    beforeRouteLeave(to, from, next) {
        if (to.name == 'TCIndex' || to.name == 'roadTransCapacity') {
        } else {
            AppFinish(-1);
        }
        next();
    },
    methods: {
        refresh() {
            this.isShowRefresh && this.$router.go(-1);
        }
    }
};
</script>

<style scoped>
.error-page {
    height: 100vh;
}
.p {
    width: 100%;
    color: rgba(121, 121, 121, 1);
    line-height: 24px;
    text-align: center;
    margin-top: 24px;
}
</style>
