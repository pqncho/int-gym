import { Member } from "./Member.ts";

export class MemberList {
  #items: Member[] = [];

  add(item: Member): void {
    const exists = this.#items.some(
      (member) => member.documentId === item.documentId,
    );
    if (exists) {
      throw new Error("Ya existe un socio con ese documento.");
    }
    this.#items.push(item);
  }

  updateFee(_documentId: string, _fee: number): void {
    let encontro = false;
    this.#items.forEach((member) => {
      if (member.documentId === _documentId) {
        member.monthlyFee = _fee;
        encontro = true;
      }
    });

    if (!encontro) throw new Error("el elemento no existe");

    return;
  }

  /*updateFee(_documentId: string, _fee: number): void {
          const exists = this.#items.find(
      (member) => member.documentId === _documentId,
    );
    if (exists) {
      exists.monthlyFee = _fee;
    }
 
      }
*/

  getItems(): readonly Member[] {
    return [...this.#items];
  }

  totalFees(): number {
    return this.#items.reduce((total, member) => total + member.monthlyFee, 0);
  }

  totalDiscounted(): number {
    return this.#items.reduce(
      (total, member) =>
        total + member.monthlyFee - (member.monthlyFee * member.discount) / 100,
      0,
    );
  }
}
