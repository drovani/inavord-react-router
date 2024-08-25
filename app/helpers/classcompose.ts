export function classCompose(
    classes: string,
    uistate: { [key: string]: string } = {}
) {
    const ui: string[] = [classes];
    (Object.keys(uistate) as (keyof typeof uistate)[]).forEach((key) => {
        if (uistate[key]) {
            ui.push(...uistate[key].split(" ").map((val) => `${key}:${val}`));
        }
    });
    return ui.join(" ");
}
