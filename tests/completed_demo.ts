import * as anchor from "@project-serum/anchor";
import { Program, web3 } from "@project-serum/anchor";
import { expect } from "chai";
import { CompletedDemo } from "../target/types/completed_demo";

describe("completed_demo", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.CompletedDemo as Program<CompletedDemo>;

  const payer = provider as anchor.AnchorProvider;
  const counterAddress = web3.Keypair.generate();

  it("Is initialized!", async () => {
    // Add your test here.
    await program.methods
      .initialize()
      .accounts({
        counter: counterAddress.publicKey,
        payer: payer.wallet.publicKey,
      })
      .signers([counterAddress])
      .rpc();
    const counterState = await program.account.counter.fetch(
      counterAddress.publicKey
    );
    expect(counterState.count).to.eq(0);
  });

  it("Add 1 to Counter", async () => {
    await program.methods
      .addCount()
      .accounts({
        counter: counterAddress.publicKey,
      })
      .rpc();

    const counterState = await program.account.counter.fetch(
      counterAddress.publicKey
    );
    expect(counterState.count).to.eq(1);
  });
});
