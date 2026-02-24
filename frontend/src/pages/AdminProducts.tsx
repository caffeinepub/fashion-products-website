import { useState } from 'react';
import { useGetAllProducts, useIsCallerAdmin, useAddProduct, useUpdateProduct, useDeleteProduct } from '../hooks/useQueries';
import { useActor } from '../hooks/useActor';
import AccessDeniedScreen from '../components/AccessDeniedScreen';
import ProductForm from '../components/ProductForm';
import LoadingTimeout from '../components/LoadingTimeout';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../components/ui/alert-dialog';
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import type { Product } from '../backend';

export default function AdminProducts() {
  const { isFetching: actorFetching } = useActor();
  const { data: isAdmin, isLoading: adminLoading, refetch: refetchAdmin } = useIsCallerAdmin();
  const { data: products, isLoading: productsLoading, refetch: refetchProducts } = useGetAllProducts();
  const addProduct = useAddProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);

  const isLoadingAuth = actorFetching || adminLoading;

  if (isLoadingAuth) {
    return (
      <div className="container mx-auto px-4 py-12">
        <LoadingTimeout
          isLoading={isLoadingAuth}
          timeout={15000}
          onRetry={() => refetchAdmin()}
          loadingMessage="Checking admin permissions..."
          timeoutMessage="Permission check is taking longer than expected"
        />
      </div>
    );
  }

  if (!isAdmin) {
    return <AccessDeniedScreen />;
  }

  const handleSubmit = (data: any) => {
    if (editingProduct) {
      updateProduct.mutate(
        { id: editingProduct.id, ...data },
        {
          onSuccess: () => {
            setShowForm(false);
            setEditingProduct(null);
          },
        }
      );
    } else {
      addProduct.mutate(data, {
        onSuccess: () => {
          setShowForm(false);
        },
      });
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDelete = () => {
    if (deletingProduct) {
      deleteProduct.mutate(deletingProduct.id, {
        onSuccess: () => {
          setDeletingProduct(null);
        },
      });
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-serif font-bold mb-2">Product Management</h1>
            <p className="text-muted-foreground">Add, edit, and manage your fashion products</p>
          </div>
          <Button onClick={() => setShowForm(true)} className="gap-2" disabled={addProduct.isPending}>
            {addProduct.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            Add Product
          </Button>
        </div>

        {productsLoading ? (
          <LoadingTimeout
            isLoading={productsLoading}
            timeout={15000}
            onRetry={() => refetchProducts()}
            loadingMessage="Loading products..."
            timeoutMessage="Products are taking longer than expected to load"
          />
        ) : products && products.length > 0 ? (
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Pinterest</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id.toString()}>
                    <TableCell>
                      <img
                        src={product.imageUrl || '/assets/generated/placeholder-product.dim_400x600.png'}
                        alt={product.name}
                        className="w-16 h-24 object-cover rounded"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>${product.price.toFixed(2)}</TableCell>
                    <TableCell>
                      {product.pinterestPinId ? (
                        <span className="text-xs text-muted-foreground">✓ Linked</span>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(product)}
                          disabled={updateProduct.isPending}
                        >
                          {updateProduct.isPending && editingProduct?.id === product.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Pencil className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeletingProduct(product)}
                          disabled={deleteProduct.isPending}
                        >
                          {deleteProduct.isPending && deletingProduct?.id === product.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4 text-destructive" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-16 border rounded-lg">
            <p className="text-muted-foreground mb-4">No products yet. Add your first product to get started.</p>
            <Button onClick={() => setShowForm(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Product
            </Button>
          </div>
        )}
      </div>

      {/* Add/Edit Product Dialog */}
      <Dialog open={showForm} onOpenChange={(open) => !open && handleCancel()}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
          </DialogHeader>
          <ProductForm
            mode={editingProduct ? 'edit' : 'create'}
            product={editingProduct || undefined}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isSubmitting={addProduct.isPending || updateProduct.isPending}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingProduct} onOpenChange={(open) => !open && setDeletingProduct(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deletingProduct?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteProduct.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteProduct.isPending}
              className="bg-destructive hover:bg-destructive/90"
            >
              {deleteProduct.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
