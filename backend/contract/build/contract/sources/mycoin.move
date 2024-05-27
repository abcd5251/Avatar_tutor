module contract::mycoin {
    use std::option;
    use sui::coin::{Self, Coin, TreasuryCap};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::url::{Self};

    // One Time Witness
    public struct MYCOIN has drop {}

    // Restrict only admin can call
    public struct Boss has key{
        id: UID,
    }

    // init with one-time-witness
    fun init(otw: MYCOIN, ctx: &mut TxContext) {
        let decimals = 6;
        let symbol = b"AVATAR";
        let name = b"Avatar coin";
        let description = b"AI Avatar reward";
        let icon_url = url::new_unsafe_from_bytes(b"https://pin.ski/3PKHM4G");

        let (treasury, metadata) = coin::create_currency(otw, decimals, symbol, name, description, option::some(icon_url), ctx);
        transfer::public_freeze_object(metadata);
        // transfer::public_share_object(metadata);
        transfer::public_transfer(treasury, tx_context::sender(ctx));

        let boss = Boss{
            id: object::new(ctx),
        };
        transfer::transfer(boss, tx_context::sender(ctx));
    }

    public entry fun issue_token(
        _: &Boss, treasury_cap: &mut TreasuryCap<MYCOIN>, recipient: address, ctx: &mut TxContext
    ) {
        coin::mint_and_transfer(treasury_cap, 10, recipient, ctx)
    }

    // public entry fun burn(treasury_cap: &mut TreasuryCap<MYCOIN>, coin: Coin<MYCOIN>) {
    //     coin::burn(treasury_cap, coin);
    // }
}
