import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export const exportToExcel = (data, summaryData, filename = "Laporan_Transaksi") => {
  // 1. Buat worksheet dari data transaksi
  const worksheet = XLSX.utils.json_to_sheet(data);

  // 2. Tentukan baris berikutnya setelah semua data transaksi
  const range = XLSX.utils.decode_range(worksheet["!ref"]);
  const nextRow = range.e.r + 3; // +3 untuk menyisakan 2 baris kosong

  // 3. Siapkan data ringkasan dalam format array of arrays
  const summaryRows = [
    [], // Baris kosong
    ["Ringkasan Penjualan"],
    ["Grand Total:", summaryData.grandTotal],
    ["Total QRIS:", summaryData.totalQris],
    ["Total Tunai:", summaryData.totalTunai],
  ];

  // 4. Tambahkan ringkasan ke worksheet, dimulai dari baris yang ditentukan
  XLSX.utils.sheet_add_aoa(worksheet, summaryRows, { origin: `A${nextRow}` });

  // 5. Perbarui rentang (`!ref`) worksheet agar mencakup data ringkasan
  const finalLastRow = nextRow + summaryRows.length - 1;
  const lastCol = XLSX.utils.decode_range(worksheet["!ref"]).e.c;
  worksheet["!ref"] = XLSX.utils.encode_range({ s: { c: 0, r: 0 }, e: { c: lastCol, r: finalLastRow } });

  // 6. Buat workbook dan simpan
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Laporan");

  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const dataBlob = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
  });
  saveAs(dataBlob, `${filename}.xlsx`);
};