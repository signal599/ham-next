// The mobile nav is a DaisyUI drawer, whose open state is a checkbox rendered
// in the root layout. That layout doesn't unmount on navigation, so following a
// link leaves the drawer open unless it is closed explicitly.
export const DRAWER_ID = "my-drawer-2";

export function closeDrawer() {
  const toggle = document.getElementById(DRAWER_ID);
  if (toggle instanceof HTMLInputElement) toggle.checked = false;
}
