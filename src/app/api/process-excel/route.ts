import { NextRequest, NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import nodemailer from 'nodemailer';
import { parse, isWithinInterval, startOfMonth, endOfMonth } from 'date-fns';

interface VehicleData {
  'Registration Number': string;
  'Fitness Expiry Date': string;
  'Insurance Expiry Date': string;
  'Pollution Expiry Date': string;
  'Permit Expiry Date': string;
  'National Expiry Date': string;
}

interface ExpiryCount {
  fitness: number;
  insurance: number;
  pollution: number;
  permit: number;
  national: number;
}

interface Document {
  name: string;
  date: string;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const email = formData.get('email') as string;
    const month = formData.get('month') as string;

    if (!file || !email || !month) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Read the Excel file
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(worksheet) as VehicleData[];

    // Parse the selected month
    const selectedDate = parse(month, 'yyyy-MM', new Date());
    const monthStart = startOfMonth(selectedDate);
    const monthEnd = endOfMonth(selectedDate);

    // Process the data
    const expiringVehicles: VehicleData[] = [];
    const expiryCount: ExpiryCount = {
      fitness: 0,
      insurance: 0,
      pollution: 0,
      permit: 0,
      national: 0,
    };

    jsonData.forEach((vehicle) => {
      const checkExpiry = (date: string, type: keyof ExpiryCount) => {
        const expiryDate = new Date(date);
        if (
          isWithinInterval(expiryDate, {
            start: monthStart,
            end: monthEnd,
          })
        ) {
          expiryCount[type]++;
          if (!expiringVehicles.includes(vehicle)) {
            expiringVehicles.push(vehicle);
          }
        }
      };

      checkExpiry(vehicle['Fitness Expiry Date'], 'fitness');
      checkExpiry(vehicle['Insurance Expiry Date'], 'insurance');
      checkExpiry(vehicle['Pollution Expiry Date'], 'pollution');
      checkExpiry(vehicle['Permit Expiry Date'], 'permit');
      checkExpiry(vehicle['National Expiry Date'], 'national');
    });

    // Helper function to create document-specific tables
    const createDocumentTable = (
      documentName: string,
      dateField: keyof VehicleData,
      vehicles: VehicleData[]
    ) => {
      const filteredVehicles = vehicles.filter((vehicle) => {
        const expiryDate = new Date(vehicle[dateField]);
        return isWithinInterval(expiryDate, {
          start: monthStart,
          end: monthEnd,
        });
      });

      if (filteredVehicles.length === 0) return '';

      return `
        <h4>${documentName} Expiring (${filteredVehicles.length})</h4>
        <table border="1" style="border-collapse: collapse; width: 100%; margin-bottom: 20px;">
          <tr style="background-color: #f2f2f2;">
            <th style="padding: 8px;">Registration Number</th>
            <th style="padding: 8px;">Expiry Date</th>
          </tr>
          ${filteredVehicles
            .map(
              (vehicle) => `
              <tr>
                <td style="padding: 8px;">${vehicle['Registration Number']}</td>
                <td style="padding: 8px;">${vehicle[dateField]}</td>
              </tr>
            `
            )
            .join('')}
        </table>
      `;
    };

    // Create email content with separate tables
    const emailContent = `
      <h2 style="color: #333;">Vehicle Document Expiry Report</h2>
      <h3>Summary for ${month}</h3>
      <ul>
        <li>Fitness Certificates Expiring: ${expiryCount.fitness}</li>
        <li>Insurance Policies Expiring: ${expiryCount.insurance}</li>
        <li>Pollution Certificates Expiring: ${expiryCount.pollution}</li>
        <li>Permits Expiring: ${expiryCount.permit}</li>
        <li>National Permits Expiring: ${expiryCount.national}</li>
      </ul>
      
      <h3 style="color: #333; margin-top: 30px;">Detailed Reports</h3>
      ${createDocumentTable(
        'Fitness Certificates',
        'Fitness Expiry Date',
        expiringVehicles
      )}
      ${createDocumentTable(
        'Insurance Policies',
        'Insurance Expiry Date',
        expiringVehicles
      )}
      ${createDocumentTable(
        'Pollution Certificates',
        'Pollution Expiry Date',
        expiringVehicles
      )}
      ${createDocumentTable('Permits', 'Permit Expiry Date', expiringVehicles)}
      ${createDocumentTable(
        'National Permits',
        'National Expiry Date',
        expiringVehicles
      )}
    `;

    // Configure email transport with updated SSL settings
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: Number(process.env.SMTP_PORT) === 465, // `true` only for port 465, `false` for other ports
      tls: {
        // Do not fail on invalid certs
        rejectUnauthorized: false
      },
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Send email with configurable from address
    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: email,
      subject: `Vehicle Document Expiry Report - ${month}`,
      html: emailContent,
    });

    return NextResponse.json(
      { message: 'Report generated and sent successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { error: 'Failed to process the request' },
      { status: 500 }
    );
  }
}