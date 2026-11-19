import { Member, PLAN_LABELS } from "../domain/Member.ts";
import type { MemberData, Plan } from "../domain/Member.ts";
import { MemberList } from "../domain/MemberList.ts";
import mockMembers from "../data/members.json";

const memberList = new MemberList();
const inpDiscount = document.getElementById(
  "inp-descuento",
) as HTMLInputElement | null;
const inpName = document.getElementById("inp-name") as HTMLInputElement | null;
const inpDocument = document.getElementById(
  "inp-document",
) as HTMLInputElement | null;
const selPlan = document.getElementById("sel-plan") as HTMLSelectElement | null;
const inpFee = document.getElementById("inp-fee") as HTMLInputElement | null;
const btnAdd = document.getElementById("btn-add") as HTMLButtonElement | null;
const errorContainer = document.getElementById(
  "error-container",
) as HTMLDivElement | null;
const errorMsg = document.getElementById(
  "error-msg",
) as HTMLParagraphElement | null;
const membersList = document.getElementById(
  "members-list",
) as HTMLDivElement | null;
const membersEmptyMsg = document.getElementById(
  "members-empty-msg",
) as HTMLParagraphElement | null;
const membersCount = document.getElementById(
  "members-count",
) as HTMLSpanElement | null;
const inpTotalMembers = document.getElementById(
  "inp-total-members",
) as HTMLInputElement | null;
const inpTotalFees = document.getElementById(
  "inp-total-fees",
) as HTMLInputElement | null;

const inpTotalDiscount = document.getElementById(
  "inp-total-descuento",
) as HTMLInputElement | null;

function clearInputs(): void {
  if (inpName && inpDocument && inpFee && inpDiscount) {
    inpName.value = "";
    inpDocument.value = "";
    inpFee.value = "";
    inpDiscount.value = "";
  }
}

function showError(message: string): void {
  if (errorContainer && errorMsg) {
    errorMsg.textContent = message;
    errorContainer.classList.remove("d-none");
  }
}

function hideError(): void {
  errorContainer?.classList.add("d-none");
}

function createText(text: string): HTMLParagraphElement {
  const paragraph = document.createElement("p");
  paragraph.className = "card-text mb-1";
  paragraph.textContent = text;
  return paragraph;
}

function createFeeEditor(member: Member): HTMLDivElement {
  const group = document.createElement("div");
  group.className = "input-group input-group-sm";
  const input = document.createElement("input");
  input.className = "form-control";
  input.type = "number";
  input.value = String(member.monthlyFee);
  input.setAttribute("aria-label", `Nueva cuota de ${member.name}`);
  const button = document.createElement("button");
  button.type = "button";
  button.className = "btn btn-outline-secondary";
  button.textContent = "Guardar cuota";
  button.addEventListener("click", () => {
    const newFee = Number(input.value);

    if (input.value.trim() === "" || !Number.isFinite(newFee) || newFee <= 0) {
      input.classList.add("is-invalid");
      return;
    }

    input.classList.remove("is-invalid");

    member.monthlyFee = newFee;
  });
  group.append(input, button);
  return group;
}

function createCard(member: Member): HTMLDivElement {
  const span = document.createElement("span");
  span.className = "badge text-bg-secondary";
  span.textContent = PLAN_LABELS[member.plan];
  const column = document.createElement("div");
  column.className = "col";
  const card = document.createElement("div");
  card.className = "card h-100";
  const body = document.createElement("div");
  body.className = "card-body";
  const title = document.createElement("h5");
  title.className = "card-title";
  title.textContent = member.name;
  const lines = [
    `Documento: ${member.documentId}`,
    `Cuota mensual: $${member.monthlyFee}`,
  ];
  if (member.discount > 0) {
    lines.push(`Descuento: ${member.discount}%`);
  }
  body.append(span, title, ...lines.map(createText));
  const footer = document.createElement("div");
  footer.className = "card-footer bg-transparent";
  footer.append(createFeeEditor(member));
  card.append(body, footer);
  column.append(card);
  return column;
}

function updateList(): void {
  if (membersList && membersEmptyMsg && membersCount) {
    const members = memberList.getItems();
    membersCount.textContent = String(members.length);
    membersEmptyMsg.classList.toggle("d-none", members.length > 0);
    membersList.replaceChildren(...members.map(createCard));
  }
}

function updateTotals(): void {
  if (inpTotalMembers && inpTotalFees && inpTotalDiscount) {
    inpTotalMembers.value = String(memberList.getItems().length);
    inpTotalFees.value = String(memberList.totalFees());
    inpTotalDiscount.value = String(memberList.totalDiscounted());
  }
}

function loadMockData(): void {
  for (const data of mockMembers as (MemberData & { discount?: number })[]) {
    const member = new Member(data);
    member.discount = data.discount ?? 0;
    memberList.add(member);
  }
}

loadMockData();
updateList();
updateTotals();

if (btnAdd && inpName && inpDocument && selPlan && inpFee && inpDiscount) {
  btnAdd.addEventListener("click", () => {
    try {
      const member = new Member({
        name: inpName.value,
        documentId: inpDocument.value,
        plan: selPlan.value as Plan,
        monthlyFee: Number(inpFee.value),
        discount: Number(inpDiscount.value),
      });
      memberList.add(member);
      hideError();
      clearInputs();
      updateList();
      updateTotals();
    } catch (error) {
      showError(error instanceof Error ? error.message : String(error));
    }
  });
}



/*
 * MÉTODOS DE ARRAYS - RESUMEN
 *
 * Todos reciben una función (callback) que se ejecuta para cada elemento.
 * Ejemplo base: const cities: City[] = [...]
 *
 * forEach((item, index) => ...)
 *   Recorre el array y ejecuta algo con cada elemento. NO devuelve nada.
 *   Se usa para efectos: mostrar en pantalla, imprimir, etc.
 *   cities.forEach((city) => console.log(city.cityName));
 *
 * find((item) => condición)
 *   Devuelve el PRIMER elemento que cumple la condición, o undefined si no hay.
 *   const roma = cities.find((city) => city.cityName === "Roma");
 *
 * some((item) => condición)
 *   Devuelve true si AL MENOS UN elemento cumple la condición, sino false.
 *   const hayItalia = cities.some((city) => city.country === "Italia");
 *
 * every((item) => condición)
 *   Devuelve true si TODOS cumplen la condición.
 *   const todasConNotas = cities.every((city) => city.notes !== "");
 *
 * filter((item) => condición)
 *   Devuelve un NUEVO array solo con los elementos que cumplen la condición.
 *   (si ninguno cumple, devuelve [])
 *   const deItalia = cities.filter((city) => city.country === "Italia");
 *
 * map((item) => valor)
 *   Devuelve un NUEVO array transformando cada elemento (mismo largo).
 *   const nombres = cities.map((city) => city.cityName); // ["Roma", "París"]
 *
 * reduce((acumulador, item) => nuevoAcumulador, valorInicial)
 *   Junta todos los elementos en UN solo valor (suma, total, etc).
 *   const total = cities.reduce((sum, city) => sum + city.accommodation.cost, 0);
 *
 * findIndex((item) => condición)
 *   Como find, pero devuelve la POSICIÓN (o -1 si no hay).
 *   const i = cities.findIndex((city) => city.cityName === "Roma");
 *
 * Cuál usar:
 *   ¿Quiero uno solo?            -> find
 *   ¿Quiero saber si existe?     -> some
 *   ¿Quiero varios?              -> filter
 *   ¿Quiero transformar?         -> map
 *   ¿Quiero un total?            -> reduce
 *   ¿Solo hacer algo con cada uno? -> forEach
 *
 * Ojo: filter, map y find NO modifican el array original.
 */
