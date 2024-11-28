let savedProducts = [];  // نقل المتغير إلى نطاق أوسع ليكون متاحًا في كل الدوال

document.addEventListener('DOMContentLoaded', () => {
    const addButton = document.getElementById('addProductButton');
    const tableBody = document.querySelector('table tbody');

    // استرجاع البيانات المخزنة من Local Storage
    savedProducts = JSON.parse(localStorage.getItem('products')) || [];

    // دالة لعرض المنتجات من Local Storage
    function displayProducts() {
        tableBody.innerHTML = ''; // مسح الجدول الحالي
        savedProducts.forEach(product => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${product.name}</td>
                <td>${product.category}</td>
                <td>${product.price.toFixed(2)}</td>
                <td>${product.quantity}</td>
                <td>${product.discount}%</td>
                <td>${product.totalPrice.toFixed(2)}</td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="editProduct(this)">تعديل</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteProduct(this)">حذف</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }

    // عرض المنتجات عند تحميل الصفحة
    displayProducts();

    addButton.addEventListener('click', () => {
        const productNameInput = document.querySelector('input[aria-describedby="productName"]');
        const productCategoryInput = document.querySelector('input[aria-describedby="productCategory"]');
        const productPriceInput = document.querySelector('input[aria-describedby="productPrice"]');
        const productQuantityInput = document.querySelector('input[aria-describedby="productQuantity"]');
        const productDiscountInput = document.querySelector('input[aria-describedby="productDiscount"]');

        const productName = productNameInput.value.trim();
        const productCategory = productCategoryInput.value.trim();
        const productPrice = parseFloat(productPriceInput.value.trim());
        const productQuantity = parseInt(productQuantityInput.value.trim());
        const productDiscount = parseFloat(productDiscountInput.value.trim());

        if (productName === '' || productCategory === '' || isNaN(productPrice) || isNaN(productQuantity) || isNaN(productDiscount)) {
            alert("يرجى ملء جميع الحقول بشكل صحيح.");
            return;
        }

        const totalPrice = (productPrice - (productPrice * productDiscount / 100)) * productQuantity;

        // إضافة المنتج إلى المصفوفة مع معرف فريد
        const product = {
            id: new Date().getTime(),  // معرف فريد باستخدام الوقت الحالي
            name: productName,
            category: productCategory,
            price: productPrice,
            quantity: productQuantity,
            discount: productDiscount,
            totalPrice: totalPrice
        };

        savedProducts.push(product); // إضافة المنتج إلى المصفوفة
        localStorage.setItem('products', JSON.stringify(savedProducts)); // حفظ البيانات في Local Storage

        // إعادة عرض المنتجات
        displayProducts();

        // إفراغ المدخلات
        productNameInput.value = '';
        productCategoryInput.value = '';
        productPriceInput.value = '';
        productQuantityInput.value = '';
        productDiscountInput.value = '';
    });
});

// تعديل المنتج
function editProduct(button) {
    const row = button.closest('tr');
    const cells = row.querySelectorAll('td');
    
    document.querySelector('input[aria-describedby="productName"]').value = cells[0].textContent;
    document.querySelector('input[aria-describedby="productCategory"]').value = cells[1].textContent;
    document.querySelector('input[aria-describedby="productPrice"]').value = cells[2].textContent;
    document.querySelector('input[aria-describedby="productQuantity"]').value = cells[3].textContent;
    document.querySelector('input[aria-describedby="productDiscount"]').value = cells[4].textContent;

    // حذف الصف بعد التعديل
    const index = savedProducts.findIndex(product => product.name === cells[0].textContent.trim());
    if (index !== -1) {
        savedProducts.splice(index, 1); // إزالة المنتج من المصفوفة
        localStorage.setItem('products', JSON.stringify(savedProducts)); // حفظ التغييرات
    }
    row.remove();
}

// حذف المنتج
function deleteProduct(button) {
    const row = button.closest('tr');
    const cells = row.querySelectorAll('td');
    const productName = cells[0].textContent.trim(); // استخدام اسم المنتج كمعرف

    // العثور على المنتج باستخدام الاسم الفريد
    const productIndex = savedProducts.findIndex(product => product.name === productName);
    
    if (productIndex !== -1) {
        savedProducts.splice(productIndex, 1); // إزالة المنتج من المصفوفة
        localStorage.setItem('products', JSON.stringify(savedProducts)); // حفظ التغييرات في LocalStorage
    }

    row.remove();
}
