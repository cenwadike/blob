use anchor_lang::prelude::*;

declare_id!("MdipYrupGnHNeJgYrtNM5p1wChqeNMZ5RRwPdrqAn3W");

#[program]
pub mod blob {
    use super::*;

    pub fn initialize(_ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }

    pub fn update_blob(ctx: Context<Update>, data: String) -> Result<()> {
        let blob_account = &mut ctx.accounts.blob_account;
        blob_account.data = data.as_bytes().to_vec();

        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = user,
        space = 8 + Blob::LEN,
        seeds = [b"blob"], 
        bump
    )]
    pub blob_account: Account<'info, Blob>,
    // signer info
    #[account(mut)]
    pub user: Signer<'info>,
    // account holding the contract binary
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Update<'info> {
    #[account(mut, seeds = [b"blob"], bump)]
    pub blob_account: Account<'info, Blob>,
    #[account(mut)]
    pub user: Signer<'info>,
}

#[account]
pub struct Blob {
    data: Vec<u8>,
}

impl Blob {
    pub const LEN: usize = (1 + 32);
}
