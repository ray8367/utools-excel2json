<template>
  <a-tabs default-active-key="2">
    <a-tab-pane key="1" title="Tab 1"> Content of Tab Panel 1 </a-tab-pane>
    <a-tab-pane key="2" title="Tab 2"> Content of Tab Panel 2 </a-tab-pane>
    <a-tab-pane key="3">
      <template #title>Tab 3</template>
      <div class="main">Content of Tab Panel 3</div>
    </a-tab-pane>
  </a-tabs>
</template>

<script setup></script>
<style scoped lang="scss">
$color: #f00;
.main {
  color: $color;
}
</style>
