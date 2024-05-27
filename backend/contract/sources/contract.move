module contract::avatar {
    use std::string::String;
    use sui::event;
    use sui::object::{Self, UID};
    use sui::transfer::{Self};
    use sui::tx_context::{Self,TxContext};
    use std::option;
    use sui::url::{Self};

    public struct Avatar has key, store {
        id: UID,
        // Category of task
        name: String,
        // Description of avatar
        description: String,
        // URL to the avatar image
        url: String,
    }

    /// Event: emitted when a new Avatar is minted.
    public struct AvatarMinted has copy, drop {
        /// ID of the Avatar
        avatar_id: ID,
        /// The address of the NFT minter
        minted_by: address,
    }

    public fun mint(
        name: String,
        description: String,
        url: String,
        ctx: &mut TxContext
    ): Avatar {
        let id = object::new(ctx);

        event::emit(AvatarMinted {
            avatar_id: id.to_inner(),
            minted_by: ctx.sender(),
        });

        Avatar { id, name, description, url }
    }

    // Destroy the Avatar
    public fun destroy(avatar: Avatar) {
        let Avatar { id, name: _, description: _, url: _ } = avatar;
        id.delete()
    }


    /// Get the Avatar's `name`
    public fun name(avatar: &Avatar): String { avatar.name }

    public fun description(avatar: &Avatar): String { avatar.description }

    public fun url(avatar: &Avatar): String { avatar.url }
}

