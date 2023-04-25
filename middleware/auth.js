export default function ({ store, redirect }) {
    if (process.client && !store.state.accounts.user) return redirect("/login");
}