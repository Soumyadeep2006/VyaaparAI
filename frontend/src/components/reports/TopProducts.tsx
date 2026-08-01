import { topProducts } from "../../constants/reportsData";

export default function TopProducts() {
  return (
    <div className="rounded-2xl bg-white p-6 shadow">

      <h2 className="mb-6 text-xl font-semibold">
        Top Selling Products
      </h2>

      <div className="overflow-x-auto">

        <table className="w-full">

          <thead className="border-b">

            <tr>

              <th className="py-3 text-left">Product</th>

              <th className="py-3 text-left">Sold</th>

              <th className="py-3 text-left">Revenue</th>

            </tr>

          </thead>

          <tbody>

            {topProducts.map((product) => (

              <tr
                key={product.id}
                className="border-b"
              >

                <td className="py-4">
                  {product.name}
                </td>

                <td>{product.sold}</td>

                <td>
                  ₹{product.revenue.toLocaleString()}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}