import { Card } from '@/app/ui/dashboard/cards';
import RevenueChart from '@/app/ui/dashboard/revenue-chart';
import LatestInvoices from '@/app/ui/dashboard/latest-invoices';
import { lusitana } from '@/app/ui/fonts';
import { fetchRevenue, fetchLatestInvoices,fetchCardData } from '../lib/data';
 
export default async function Page() {
    const revenue = await fetchRevenue();
    const latestInvoices = await fetchLatestInvoices();

  // const totalPaidInvoices = await (await fetchCardData()).totalPaidInvoices;
  // const totalPendingInvoices = await (await fetchCardData()).totalPendingInvoices;
  // const numberOfInvoices = await (await fetchCardData()).numberOfInvoices;
  // const numberOfCustomers = await (await fetchCardData()).numberOfCustomers;

/*
## above first approach :
in the above approach we are  repeatedly calling the 'await fetchDataCard()' for each property we need to extract.This means that we are fetching the data multiple times.
instead of calling like above we can follow the below appproach.Each call to await fetchCardData() initiates a new asynchronous operation, and these operations are not running concurrently. This can be less efficient, especially if fetchCardData() is an expensive operation, as you are making redundant calls.

## So when it comes to below approach : 
In this approach, you are destructuring the result of await fetchCardData() in a single step. This means that you are fetching the data only once, and then extracting the properties you need in a single operation. This is generally more efficient and concise.

*/
const {
  totalPaidInvoices,
  totalPendingInvoices,
  numberOfCustomers,
  numberOfInvoices
} =  await fetchCardData();



  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Dashboard
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card title="Collected" value={totalPaidInvoices} type="collected" />
        <Card title="Pending" value={totalPendingInvoices} type="pending" />
        <Card title="Total Invoices" value={numberOfInvoices} type="invoices" />
        <Card
          title="Total Customers"
          value={numberOfCustomers}
          type="customers"
        />
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        <RevenueChart revenue={revenue}  />
        <LatestInvoices latestInvoices={latestInvoices} />
      </div>
    </main>
  );
}