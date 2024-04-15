import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Blob } from "../target/types/blob";
import {
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Signer,
} from "@solana/web3.js";

describe("blob", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Blob as Program<Blob>;


  it("Is initialize!", async () => {
    // signer account
    const user = anchor.web3.Keypair.generate();

    // blob account 
    const [blobPDA, _a] = PublicKey.findProgramAddressSync(
      [
        anchor.utils.bytes.utf8.encode("blob"),
      ],
      program.programId
    )

    // signer signature 
    const userSig: Signer = { secretKey: user.secretKey, publicKey: user.publicKey }

    // fund user account for gas
    await provider.connection.confirmTransaction(
      await provider.connection.requestAirdrop(
        provider.wallet.publicKey,
        10 * LAMPORTS_PER_SOL
      ),
      "confirmed"
    );

    await provider.connection.confirmTransaction(
      await provider.connection.requestAirdrop(
        user.publicKey,
        10 * LAMPORTS_PER_SOL
      ),
      "confirmed"
    );

    // initialize program
    const i_tx = await program.methods.initialize().accounts(
      {
        blobAccount: blobPDA,
        user: user.publicKey,
        systemProgram: SystemProgram.programId,
      }
    ).signers([userSig]).rpc();
    console.log("Your transaction signature", i_tx);
  })

  it("Is updating!", async () => {
    // blob account 
    const [blobPDA, _a] = PublicKey.findProgramAddressSync(
      [
        anchor.utils.bytes.utf8.encode("blob"),
      ],
      program.programId
    )

    // signer account
    const user = anchor.web3.Keypair.generate();

    // signer signature 
    const userSig: Signer = { secretKey: user.secretKey, publicKey: user.publicKey }

    // fund user account for gas
    await provider.connection.confirmTransaction(
      await provider.connection.requestAirdrop(
        provider.wallet.publicKey,
        10 * LAMPORTS_PER_SOL
      ),
      "confirmed"
    );

    await provider.connection.confirmTransaction(
      await provider.connection.requestAirdrop(
        user.publicKey,
        10 * LAMPORTS_PER_SOL
      ),
      "confirmed"
    );

    // call update
    let data = "big";
    const tx = await program.methods.updateBlob(data).accounts({
      blobAccount: blobPDA,
      user: user.publicKey
    }).signers([userSig]).rpc();

    console.log("Your transaction signature", tx);
  });
});
