import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
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

  public type UserProfile = {
    name : Text;
  };

  var nextProductId = 0;
  let productsById = Map.empty<Nat, Product>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
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

  // Product Management - Admin Only
  public shared ({ caller }) func addProduct(name : Text, description : Text, price : Float, category : Text, imageUrl : Text, pinterestPinId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add products");
    };

    if (name.size() <= 0 or description.size() <= 0 or price <= 0 or category.size() <= 0 or imageUrl.size() <= 0) {
      Runtime.trap("Invalid product data");
    };

    let product : Product = {
      id = nextProductId;
      name;
      description;
      price;
      category;
      imageUrl;
      pinterestPinId;
    };

    productsById.add(nextProductId, product);
    nextProductId += 1;
  };

  public shared ({ caller }) func updateProduct(id : Nat, name : Text, description : Text, price : Float, category : Text, imageUrl : Text, pinterestPinId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update products");
    };

    switch (productsById.get(id)) {
      case (null) { Runtime.trap("Product not found") };
      case (?_) {
        if (name.size() <= 0 or description.size() <= 0 or price <= 0 or category.size() <= 0 or imageUrl.size() <= 0) {
          Runtime.trap("Invalid product data");
        };

        let updatedProduct : Product = {
          id;
          name;
          description;
          price;
          category;
          imageUrl;
          pinterestPinId;
        };

        productsById.add(id, updatedProduct);
      };
    };
  };

  public shared ({ caller }) func deleteProduct(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete products");
    };

    if (not productsById.containsKey(id)) {
      Runtime.trap("Product not found");
    };

    productsById.remove(id);
  };

  // Product Queries - Public Access (including guests)
  public query func getProduct(id : Nat) : async Product {
    switch (productsById.get(id)) {
      case (null) { Runtime.trap("Product not found") };
      case (?product) { product };
    };
  };

  public query func getAllProducts() : async [Product] {
    productsById.values().toArray();
  };
};
