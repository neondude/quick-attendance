<template>
  <div class="row justify-content-center">
    <div class="col-md-8 col-lg-7">
      <h1 class="mb-3">Settings</h1>

      <p class="text-body-secondary">
        Manage app configuration and attendance setup options.
      </p>

      <div class="list-group mt-3">
        <RouterLink class="list-group-item list-group-item-action d-flex justify-content-between align-items-center" to="/settings/classes">
          <span>Classes</span>
          <span aria-hidden="true">&rsaquo;</span>
        </RouterLink>
        <RouterLink class="list-group-item list-group-item-action d-flex justify-content-between align-items-center" to="/settings/tags">
          <span>Tags</span>
          <span aria-hidden="true">&rsaquo;</span>
        </RouterLink>
      </div>
    </div>
  </div>
</template>