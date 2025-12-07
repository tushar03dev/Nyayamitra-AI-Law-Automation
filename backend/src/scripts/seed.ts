import mongoose from 'mongoose';
import { User } from '../models/userModel';
import { Organization } from '../models/organizationModel';
import { Case } from '../models/caseModel';
import { Hearing } from '../models/hearingModel';
import { Event } from '../models/eventModel';
import { Message } from '../models/messageModel';
import { Notification } from '../models/notificationModel';
import dotenv from 'dotenv';

const env = process.env.NODE_ENV;
dotenv.config({ path: `.env.${env}` });

async function seedDatabase() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/nyayamitra';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Organization.deleteMany({});
    await Case.deleteMany({});
    await Hearing.deleteMany({});
    await Event.deleteMany({});
    await Message.deleteMany({});
    await Notification.deleteMany({});

    // Create organizations
    const organizations = await Organization.insertMany([
      {
        name: 'Nyayamitra Legal Services',
        address: 'Virtual Office, India',
        phone: '+91-9876543210',
        email: 'contact@nyayamitra.com',
        website: 'https://nyayamitra.com'
      }
    ]);

    // Create users (including existing user)
    const users = await User.insertMany([
      {
        _id: '69355e5371646b533a1769d9', // Existing user ID
        name: 'Tushar Sharma',
        email: 'panditushar75@gmail.com',
        password: null,
        role: 'junior_lawyer',
        organizationId: organizations[0]._id,
        authProvider: 'google'
      },
      {
        name: 'Rajesh Kumar',
        email: 'rajesh.kumar@nyayamitra.com',
        password: '$2a$10$hashedpassword1', // password: 'password123'
        role: 'admin',
        organizationId: organizations[0]._id,
        phone: '+91-9876543212',
        authProvider: 'local'
      },
      {
        name: 'Priya Sharma',
        email: 'priya.sharma@nyayamitra.com',
        password: '$2a$10$hashedpassword2',
        role: 'lawyer',
        organizationId: organizations[0]._id,
        phone: '+91-9876543213',
        authProvider: 'local'
      },
      {
        name: 'Amit Singh',
        email: 'amit.singh@nyayamitra.com',
        password: '$2a$10$hashedpassword3',
        role: 'lawyer',
        organizationId: organizations[0]._id,
        phone: '+91-9876543214',
        authProvider: 'local'
      },
      {
        name: 'Sneha Patel',
        email: 'sneha.patel@nyayamitra.com',
        password: '$2a$10$hashedpassword4',
        role: 'junior_lawyer',
        organizationId: organizations[0]._id,
        phone: '+91-9876543215',
        authProvider: 'local'
      }
    ]);

    // Create cases
    const cases = await Case.insertMany([
      {
        organizationId: organizations[0]._id,
        title: 'Smith v. Corporation - Breach of Contract',
        caseNumber: 'CS-2024-001',
        clientNames: ['John Smith', 'Jane Smith'],
        description: 'Client alleges breach of employment contract by former employer',
        status: 'ongoing',
        priority: 'high',
        assignedLawyers: [users[2]._id, users[3]._id],
        assignedJuniors: [users[0]._id], // Assign to Tushar
        nextHearingDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
      },
      {
        organizationId: organizations[0]._id,
        title: 'Johnson Family - Estate Planning',
        caseNumber: 'CS-2024-002',
        clientNames: ['Robert Johnson', 'Mary Johnson'],
        description: 'Comprehensive estate planning and will preparation',
        status: 'open',
        priority: 'medium',
        assignedLawyers: [users[2]._id],
        assignedJuniors: [users[0]._id, users[4]._id], // Assign to Tushar
        nextHearingDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // 14 days from now
      },
      {
        organizationId: organizations[0]._id,
        title: 'TechCorp v. StartupInc - IP Dispute',
        caseNumber: 'CS-2024-003',
        clientNames: ['TechCorp Industries'],
        description: 'Intellectual property infringement lawsuit',
        status: 'ongoing',
        priority: 'high',
        assignedLawyers: [users[3]._id],
        assignedJuniors: [users[0]._id, users[4]._id], // Assign to Tushar
        nextHearingDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) // 3 days from now
      },
      {
        organizationId: organizations[0]._id,
        title: 'Brown v. City Council - Property Dispute',
        caseNumber: 'CS-2024-004',
        clientNames: ['Michael Brown'],
        description: 'Property zoning dispute with local government',
        status: 'on_hold',
        priority: 'medium',
        assignedLawyers: [users[2]._id],
        assignedJuniors: [users[0]._id], // Assign to Tushar
        nextHearingDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000) // 21 days from now
      },
      {
        organizationId: organizations[0]._id,
        title: 'Williams & Associates - Corporate Restructuring',
        caseNumber: 'CS-2024-005',
        clientNames: ['Williams & Associates'],
        description: 'Corporate restructuring and merger advisory',
        status: 'closed',
        priority: 'low',
        assignedLawyers: [users[3]._id],
        assignedJuniors: [users[0]._id], // Assign to Tushar
        nextHearingDate: null
      },
      {
        organizationId: organizations[0]._id,
        title: 'Digital Solutions Ltd - Employment Law',
        caseNumber: 'CS-2024-006',
        clientNames: ['Digital Solutions Ltd'],
        description: 'Wrongful termination case and severance package negotiation',
        status: 'open',
        priority: 'medium',
        assignedLawyers: [users[2]._id],
        assignedJuniors: [users[0]._id, users[4]._id], // Assign to Tushar
        nextHearingDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000) // 10 days from now
      },
      {
        organizationId: organizations[0]._id,
        title: 'Patel v. Insurance Corp - Bad Faith Claim',
        caseNumber: 'CS-2024-007',
        clientNames: ['Raj Patel'],
        description: 'Insurance bad faith claim for denied coverage',
        status: 'ongoing',
        priority: 'high',
        assignedLawyers: [users[3]._id],
        assignedJuniors: [users[0]._id], // Assign to Tushar
        nextHearingDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000) // 5 days from now
      },
      {
        organizationId: organizations[0]._id,
        title: 'Green Energy Corp - Environmental Compliance',
        caseNumber: 'CS-2024-008',
        clientNames: ['Green Energy Corp'],
        description: 'Environmental compliance and regulatory advisory',
        status: 'open',
        priority: 'low',
        assignedLawyers: [users[2]._id],
        assignedJuniors: [users[4]._id],
        nextHearingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
      }
    ]);

    // Create hearings
    const hearings = await Hearing.insertMany([
      {
        caseId: cases[0]._id,
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        time: '10:00 AM',
        location: 'District Court Room 5, Mumbai',
        judge: 'Hon. Justice Kumar',
        notes: 'Pre-trial conference for evidence disclosure',
        status: 'scheduled'
      },
      {
        caseId: cases[1]._id,
        date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        time: '2:00 PM',
        location: 'High Court Chamber 3, Mumbai',
        judge: 'Hon. Justice Sharma',
        notes: 'Will execution and estate planning review',
        status: 'scheduled'
      },
      {
        caseId: cases[2]._id,
        date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        time: '11:30 AM',
        location: 'Intellectual Property Tribunal, Delhi',
        judge: 'Hon. Justice Patel',
        notes: 'Preliminary injunction hearing',
        status: 'scheduled'
      },
      {
        caseId: cases[5]._id,
        date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        time: '3:00 PM',
        location: 'Labour Court, Mumbai',
        judge: 'Hon. Justice Reddy',
        notes: 'Employment dispute mediation',
        status: 'scheduled'
      },
      {
        caseId: cases[6]._id,
        date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        time: '1:00 PM',
        location: 'Civil Court Complex, Delhi',
        judge: 'Hon. Justice Gupta',
        notes: 'Bad faith insurance claim hearing',
        status: 'scheduled'
      },
      {
        caseId: cases[0]._id,
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        time: '9:00 AM',
        location: 'District Court Room 2, Mumbai',
        judge: 'Hon. Justice Kumar',
        notes: 'Motion hearing completed successfully',
        status: 'completed'
      },
      {
        caseId: cases[4]._id,
        date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
        time: '11:00 AM',
        location: 'Corporate Court, Mumbai',
        judge: 'Hon. Justice Desai',
        notes: 'Corporate restructuring approval hearing',
        status: 'completed'
      }
    ]);

    // Create events
    await Event.insertMany([
      {
        userId: users[0]._id, // Tushar
        date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        title: 'Client Meeting - Smith Case',
        description: 'Review case strategy with client',
        time: '3:00 PM',
        location: 'Office Conference Room A'
      },
      {
        userId: users[0]._id, // Tushar
        date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        title: 'Document Review Session',
        description: 'Review evidence for Johnson estate planning case',
        time: '10:00 AM',
        location: 'Virtual Meeting'
      },
      {
        userId: users[0]._id, // Tushar
        date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
        title: 'Legal Research',
        description: 'Research precedents for IP dispute case',
        time: '2:00 PM',
        location: 'Law Library'
      }
    ]);

    // Create messages
    await Message.insertMany([
      {
        caseId: cases[0]._id,
        senderId: users[2]._id,
        message: 'Please review the latest evidence documents for the Smith case.',
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000)
      },
      {
        caseId: cases[0]._id,
        senderId: users[0]._id, // Tushar
        message: 'Documents reviewed. I have some questions about exhibit A.',
        timestamp: new Date(Date.now() - 30 * 60 * 1000)
      },
      {
        caseId: cases[1]._id,
        senderId: users[2]._id,
        message: 'Estate planning documents are ready for review.',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
      },
      {
        caseId: cases[1]._id,
        senderId: users[0]._id, // Tushar
        message: 'I will review them by end of day.',
        timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000)
      }
    ]);


    // Create notifications
    await Notification.insertMany([
      {
        userId: users[0]._id, // Tushar
        title: 'New Case Assigned',
        message: 'You have been assigned to case CS-2024-001 (Smith v. Corporation)',
        type: 'case_assigned',
        isRead: false
      },
      {
        userId: users[0]._id, // Tushar
        title: 'Upcoming Hearing',
        message: 'Hearing scheduled for Smith v. Corporation in 7 days',
        type: 'hearing_reminder',
        isRead: false
      },
      {
        userId: users[0]._id, // Tushar
        title: 'Document Review Required',
        message: 'Please review documents for Johnson Family estate planning case',
        type: 'document_review',
        isRead: false
      },
      {
        userId: users[2]._id,
        title: 'Case Update',
        message: 'Status updated for TechCorp IP dispute case',
        type: 'case_update',
        isRead: true
      }
    ]);

    console.log('Database seeded successfully!');
    console.log(`Created ${organizations.length} organizations`);
    console.log(`Created ${users.length} users`);
    console.log(`Created ${cases.length} cases`);
    console.log(`Created ${hearings.length} hearings`);

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the seed function if this file is executed directly
if (require.main === module) {
  seedDatabase();
}

export { seedDatabase };