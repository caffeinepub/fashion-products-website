import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Float "mo:core/Float";
import Iter "mo:core/Iter";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  public type Product = {
    id : Nat;
    name : Text;
    description : Text;
    price : Float;
    category : Text;
    imageUrl : Text;
    pinterestPinId : Text;
  };

  public type ProductInput = {
    name : Text;
    description : Text;
    price : Float;
    category : Text;
    imageUrl : Text;
    pinterestPinId : Text;
  };

  public type UserProfile = {
    name : Text;
  };

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  var nextProductId = 0;
  let productsById = Map.empty<Nat, Product>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  ///////////////////
  // User Profile Management
  ///////////////////
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  ///////////////////
  // Product Management - Admin Only
  ///////////////////
  public shared ({ caller }) func addProduct(data : ProductInput) : async Nat {
    requireAdmin(caller);
    validateProductInput(data);

    let product : Product = {
      id = nextProductId;
      name = data.name;
      description = data.description;
      price = data.price;
      category = data.category;
      imageUrl = data.imageUrl;
      pinterestPinId = data.pinterestPinId;
    };

    productsById.add(nextProductId, product);
    nextProductId += 1;
    product.id;
  };

  public shared ({ caller }) func updateProduct(id : Nat, data : ProductInput) : async () {
    requireAdmin(caller);

    switch (productsById.get(id)) {
      case (null) { Runtime.trap("Product not found") };
      case (?_) {
        validateProductInput(data);

        let updatedProduct : Product = {
          id;
          name = data.name;
          description = data.description;
          price = data.price;
          category = data.category;
          imageUrl = data.imageUrl;
          pinterestPinId = data.pinterestPinId;
        };

        productsById.add(id, updatedProduct);
      };
    };
  };

  public shared ({ caller }) func deleteProduct(id : Nat) : async () {
    requireAdmin(caller);

    if (not productsById.containsKey(id)) {
      Runtime.trap("Product not found");
    };

    productsById.remove(id);
  };

  ///////////////////
  // Product Queries - Public Access (including guests)
  ///////////////////
  public query func getProduct(id : Nat) : async ?Product {
    productsById.get(id);
  };

  public query func getAllProducts() : async [Product] {
    productsById.values().toArray();
  };

  public query func getProductCount() : async Nat {
    productsById.size();
  };

  public query func getProductCountByCategory(category : Text) : async Nat {
    var count = 0;
    for (product in productsById.values()) {
      if (product.category == category) {
        count += 1;
      };
    };
    count;
  };

  public query func getProductsByCategory(
    category : Text,
  ) : async [Product] {
    productsById.values().filter(
      func(product) { product.category == category }
    ).toArray();
  };

  public query func getProductsByPriceRange(
    minPrice : Float,
    maxPrice : Float,
  ) : async [Product] {
    productsById.values().filter(
      func(product) { product.price >= minPrice and product.price <= maxPrice }
    ).toArray();
  };

  public query func getProductsByName(
    nameQuery : Text,
  ) : async [Product] {
    productsById.values().filter(
      func(product) { product.name.contains(#text nameQuery) }
    ).toArray();
  };

  ///////////////////
  // Helper Methods
  ///////////////////
  func validateProductInput(data : ProductInput) : () {
    if (data.name.size() <= 0 or data.description.size() <= 0 or data.price <= 0 or data.price > 1000000 or data.category.size() <= 0 or data.category.size() > 50 or data.imageUrl.size() <= 0 or data.imageUrl.size() > 500) {
      Runtime.trap("Invalid product data");
    };
  };

  func requireAdmin(caller : Principal) : () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
  };
};
