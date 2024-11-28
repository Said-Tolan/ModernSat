document.addEventListener('DOMContentLoaded', function () {
    const addProductBtn = document.getElementById('addProductBtn');
    const totalPriceElement = document.getElementById('totalPrice');
    const tableBody = document.getElementById('productTableBody');
    let currentRow = null; // لتخزين الصف الحالي المعدل

    // تحقق من أن tableBody موجود في الصفحة
    if (!tableBody) {
        alert("لم يتم العثور على العنصر tableBody في الصفحة.");
        console.error("لم يتم العثور على tableBody في الصفحة.");
        return;
    }

    // عند الضغط على زر "إضافة المنتج"
    addProductBtn.addEventListener('click', function (e) {
        e.preventDefault(); // منع إعادة تحميل الصفحة

        // الحصول على القيم المدخلة
        const customerName = document.getElementById('customerName').value;
        const productName = document.getElementById('productName').value;
        const productCategory = document.getElementById('productCategory').value;
        const accessories = document.getElementById('accessories').value;
        const phoneNumber = document.getElementById('phoneNumber').value;
        const price = parseFloat(document.getElementById('price').value);
        const quantity = parseInt(document.getElementById('quantity').value);
        const discount = parseFloat(document.getElementById('discount').value);

        // التحقق من المدخلات
        if (isNaN(price) || isNaN(quantity) || isNaN(discount)) {
            alert("يرجى التأكد من إدخال القيم بشكل صحيح.");
            return;
        }

        // حساب الإجمالي بعد الخصم
        const discountAmount = (price * discount) / 100;
        const finalPrice = (price - discountAmount) * quantity;

        // إذا كان هناك صف يتم تعديله
        if (currentRow) {
            const cells = currentRow.querySelectorAll('td');
            cells[0].textContent = customerName;
            cells[1].textContent = productName;
            cells[2].textContent = productCategory;
            cells[3].textContent = accessories;
            cells[4].textContent = phoneNumber;
            cells[5].textContent = price + ' ج.م';
            cells[6].textContent = quantity;
            cells[7].textContent = discount + ' %';
            cells[8].textContent = new Date().toLocaleDateString();
            cells[9].textContent = finalPrice.toFixed(2) + ' ج.م';

            // إعادة تعيين النص في الزر
            addProductBtn.textContent = 'إضافة المنتج';
            currentRow = null; // إعادة تعيين الصف الحالي المعدل
        } else {
            // إضافة صف جديد إلى الجدول
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${customerName}</td>
                <td>${productName}</td>
                <td>${productCategory}</td>
                <td>${accessories}</td>
                <td>${phoneNumber}</td>
                <td>${price} ج.م</td>
                <td>${quantity}</td>
                <td>${discount} %</td>
                <td>${new Date().toLocaleDateString()}</td>
                <td>${finalPrice.toFixed(2)} ج.م</td>
                <td>
                    <button class="btn btn-warning editBtn">تعديل</button>
                    <button class="btn btn-danger deleteBtn">حذف</button>
                </td>
            `;
            // إضافة الصف إلى الجدول
            tableBody.appendChild(row);

            // إضافة أحداث الأزرار (تعديل وحذف)
            addDeleteAndEditEvents(row);
        }

        // تحديث السعر الإجمالي
        updateTotalPrice();

        // إفراغ المدخلات بعد إضافة المنتج
        document.getElementById('customerName').value = '';
        document.getElementById('productName').value = '';
        document.getElementById('productCategory').value = '';
        document.getElementById('accessories').value = '';
        document.getElementById('phoneNumber').value = '';
        document.getElementById('price').value = '';
        document.getElementById('quantity').value = '';
        document.getElementById('discount').value = '';
    });

    // تحديث السعر الإجمالي
    function updateTotalPrice() {
        let totalPrice = 0;
        const rows = tableBody.querySelectorAll('tr');
        rows.forEach(row => {
            const price = parseFloat(row.cells[9].textContent.replace(' ج.م', ''));
            totalPrice += price;
        });
        totalPriceElement.textContent = totalPrice.toFixed(2) + ' ج.م';
    }

    // إضافة أحداث الحذف والتعديل
    function addDeleteAndEditEvents(row) {
        // زر الحذف
        const deleteBtn = row.querySelector('.deleteBtn');
        deleteBtn.addEventListener('click', function () {
            row.remove();
            updateTotalPrice();
        });

        // زر التعديل
        const editBtn = row.querySelector('.editBtn');
        editBtn.addEventListener('click', function () {
            // استخراج القيم الحالية من الصف
            const cells = row.querySelectorAll('td');
            const customerName = cells[0].textContent;
            const productName = cells[1].textContent;
            const productCategory = cells[2].textContent;
            const accessories = cells[3].textContent;
            const phoneNumber = cells[4].textContent;
            const price = parseFloat(cells[5].textContent.replace(' ج.م', ''));
            const quantity = parseInt(cells[6].textContent);
            const discount = parseFloat(cells[7].textContent.replace(' %', ''));

            // ملء الحقول بالنماذج
            document.getElementById('customerName').value = customerName;
            document.getElementById('productName').value = productName;
            document.getElementById('productCategory').value = productCategory;
            document.getElementById('accessories').value = accessories;
            document.getElementById('phoneNumber').value = phoneNumber;
            document.getElementById('price').value = price;
            document.getElementById('quantity').value = quantity;
            document.getElementById('discount').value = discount;

            // تحديد الصف الحالي للتعديل
            currentRow = row;
            addProductBtn.textContent = 'تحديث المنتج'; // تغيير النص ليدل على التحديث
        });
    }
});
