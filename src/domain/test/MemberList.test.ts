import { describe, expect, test, beforeEach } from "vitest";
import { Member } from "../Member.ts";
import { MemberList } from "../MemberList.ts";

describe("MemberList", () => {
  let list: MemberList;
  let member: Member;

  beforeEach(() => {
    list = new MemberList();
    member = new Member({
      name: "Ana Pérez",
      documentId: "12345678",
      plan: "full",
      monthlyFee: 1500,
      discount: 40,
    });
  });

  test("Create an empty member list", () => {
    expect(list.getItems()).toEqual([]);
  });

  test("add a member", () => {
    list.add(member);
    expect(list.getItems()).toEqual([member]);
  });

  test("reject a duplicated document id", () => {
    list.add(member);
    expect(() => list.add(member)).toThrow();
  });

  test("total fees", () => {
    list.add(member);
    expect(list.totalFees()).toBe(1500);
  });

 test("total discount", () => {
    list.add(member);
    expect(list.totalDiscounted()).toBe(900);
  });


   test("update fee of a non exist member", () => {
    list.add(member);
    expect(() => (list.updateFee('45',45))).toThrow("el elemento no existe");
  });

  test("update fee", () => {
    list.add(member);
    list.updateFee("12345678",45);
    expect(member.monthlyFee == 45).toBe(true);
  });


});
