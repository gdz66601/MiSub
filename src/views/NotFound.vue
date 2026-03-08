<template>
  <div class="nginx-error-page">
    <center><h1>404 Not Found</h1></center>
    <hr>
    <center>nginx</center>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue';
import { resetToDisguise } from '../utils/dynamic-head';

onMounted(() => {
    // 进入伪装状态：移除 favicon、manifest 等特征
    resetToDisguise();
});

onUnmounted(() => {
    // 离开时不需要恢复，由其他页面/组件自行注入
});
</script>

<style scoped>
.nginx-error-page {
    font-family: Tahoma, Verdana, Arial, sans-serif;
    width: 35em;
    margin: 0 auto;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    background: #fff;
    z-index: 99999;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: #000;
}

.nginx-error-page center {
    display: block;
}

.nginx-error-page h1 {
    font-size: 1.5em;
    font-weight: bold;
}

.nginx-error-page hr {
    width: 100%;
    max-width: 35em;
    border: none;
    border-top: 1px solid #ccc;
    margin: 0.5em 0;
}
</style>
