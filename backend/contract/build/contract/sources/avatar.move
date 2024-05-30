module contract::avatar {
    use sui::url::{Self, Url};
    use std::string;
    use sui::object::{Self, ID, UID};
    use sui::event;
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};

    public struct AvatarNFT has key, store {
        id: UID,
        /// Name for the NFT
        name: string::String,
        /// Description of the NFT
        description: string::String,
        /// Create time of the token
        createtime : string::String,
        
        url: Url,
        
    }

    // ===== Events =====

    public struct NFTMinted has copy, drop {
        // The Object ID of the NFT
        object_id: ID,
        // The creator of the NFT
        creator: address,
        // The name of the NFT
        name: string::String,
    }


    /// Get the NFT's `name`
    public fun name(nft: &AvatarNFT): &string::String {
        &nft.name
    }

    /// Get the NFT's `description`
    public fun createtime(nft: &AvatarNFT): &string::String {
        &nft.createtime
    }

    /// Get the NFT's `description`
    public fun description(nft: &AvatarNFT): &string::String {
        &nft.description
    }

    /// Get the NFT's `url`
    public fun url(nft: &AvatarNFT): &Url {
        &nft.url
    }


    public entry fun mint_to_sender(
        name: vector<u8>,
        description: vector<u8>,
        createtime: vector<u8>,
        url: vector<u8>,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);
        let nft = AvatarNFT {
            id: object::new(ctx),
            name: string::utf8(name),
            description: string::utf8(description),
            createtime: string::utf8(createtime),
            url: url::new_unsafe_from_bytes(url)
        };

        event::emit(NFTMinted {
            object_id: object::id(&nft),
            creator: sender,
            name: nft.name,
        });

        transfer::public_transfer(nft, sender);
    }


    /// Permanently delete `nft`
    public fun burn(nft: AvatarNFT, _: &mut TxContext) {
        let AvatarNFT { id, name: _, description: _, createtime: _, url: _ } = nft;
        object::delete(id)
    }
}